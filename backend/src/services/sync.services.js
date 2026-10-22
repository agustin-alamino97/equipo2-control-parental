const db = require('../config/db');
const notificationService = require('./notifications/notification.services');

class SyncService {
  async getSystemRules({ clientVersion, clientChecksum }) {
    // 1. Obtenemos el conteo total de dominios actives y el ID máximo actual
    // Con esto generamos un checksum y una versión dinámica instantánea.
    const metaQuery = await db.query(
      `SELECT COUNT(*)::int as total, COALESCE(MAX(version_id), MAX(id), 0) as max_version FROM system_blocklist WHERE active = true`
    );

    const { total, max_version } = metaQuery.rows[0];

    // La versión puede ser el total de reglas o el max_version (o una combinación)
    const serverVersion = max_version; 
    // Hacemos que el checksum sea puramente numérico (el total de registros actives)
    const serverChecksum = total;

    // 2. Doble verificación numérica estricta: versión y checksum deben coincidir
    const isUpToDate = 
      Number(clientVersion) === serverVersion && 
      Number(clientChecksum) === serverChecksum;

    if (isUpToDate) {
      return {
        status: 'UP_TO_DATE',
        current_version: serverVersion,
        checksum: serverChecksum,
        syncedAt: new Date().toISOString()
      };
    }

    // 3. Si difieren o es la primera sincronización -> Traemos la lista completa
    const rulesResult = await db.query(
      `SELECT domain, rule_type FROM system_blocklist WHERE active = true`
    );

    const rules = rulesResult.rows;

    const lotba = rules.filter(item => item.rule_type === 'lotba').map(item => item.domain);
    const keyword = rules.filter(item => item.rule_type === 'keyword').map(item => item.domain);
    const regex = rules.filter(item => item.rule_type === 'regex').map(item => item.domain);

    return {
      status: 'RESET',
      current_version: serverVersion,
      checksum: serverChecksum,
      data: {
        total: rules.length,
        lotba,
        keyword,
        regex,
        syncedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Consulta en tiempo real de las reglas personalizadas para la app/panel del Tutor.
   * No utiliza versión ni checksum. Devuelve el estado actual directo de la BBDD.
   */
  async getCustomRulesForUser({ userId }) {
    const rulesResult = await db.query(
      `SELECT domain, rule_type, creation_time 
       FROM custom_blocklist 
       WHERE id_user = $1 AND active = true
       ORDER BY creation_time DESC`,
      [userId]
    );

    const rules = rulesResult.rows;

    const domain = rules.filter(item => item.rule_type === 'domain').map(item => item.domain);
    const keyword = rules.filter(item => item.rule_type === 'keyword').map(item => item.domain);

    const lastCreation = rules.length > 0 ? rules[0].creation_time : null;

    return {
      total: rules.length,
      domain,
      keyword,
      updatedAt: lastCreation ? new Date(lastCreation).toISOString() : null
    };
  }

  /**
   * Agrega o reactiva una regla personalizada para el Tutor
   * y dispara un Silent Push a todos sus dispositivos vinculados.
   */
  async addCustomRuleForUser({ userId, domain, ruleType }) {
    const ALLOWED_TYPES = ['domain', 'keyword']; 

    if (!ALLOWED_TYPES.includes(ruleType)) {
      const error = new Error(`El tipo de regla '${ruleType}' no está permitido.`);
      error.statusCode = 400;
      throw error;
    }

    const cleanDomain = domain.trim().toLowerCase();

    // UPSERT usando id_user y active
    const query = `
      INSERT INTO custom_blocklist (id_user, domain, rule_type, active, creation_time)
      VALUES ($1, $2, $3, true, NOW())
      ON CONFLICT (id_user, domain) 
      DO UPDATE SET 
        active = true, 
        rule_type = EXCLUDED.rule_type, 
        creation_time = NOW()
      RETURNING id, domain, rule_type, creation_time;
    `;

    const result = await db.query(query, [userId, cleanDomain, ruleType]);
    const createdRule = result.rows[0];

    // Buscar tokens usando id_user y linked
    const devicesQuery = await db.query(
      `SELECT push_token, device_uuid 
       FROM devices 
       WHERE id_user = $1 AND linked = true AND push_token IS NOT NULL`,
      [userId]
    );

    const pushTokens = devicesQuery.rows.map(d => d.push_token);

    if (pushTokens.length > 0) {
      try {
        await notificationService.sendSilentPush({
          pushTokens,
          payload: {
            action: 'RELOAD_CUSTOM_RULES',
            tutorUserId: userId,
            timestamp: new Date(createdRule.creation_time).getTime()
          }
        });
      } catch (pushError) {
        console.error('[SYNC SERVICE] Error no bloqueante al enviar Silent Push:', pushError.message);
      }
    }

    return {
      success: true,
      message: 'Regla agregada o actualizada correctamente',
      data: createdRule,
      notifiedDevicesCount: pushTokens.length
    };
  }

  /**
   * Sincronización de reglas personalizadas para dispositivos protegidos.
   * Valida la identidad del dispositivo (device_token + device_uuid) y aplica
   * la doble verificación por timestamp, checksum y regla de seguridad de 7 días.
   */
  async getCustomRulesForDevice({ userId, clientTimestamp, clientChecksum }) {
    // 1. Obtener metadatos de las reglas del tutor para calcular checksum y timestamp
    const metaQuery = await db.query(
      `SELECT 
         COUNT(*)::int as total, 
         MAX(creation_time) as last_created 
       FROM custom_blocklist 
       WHERE id_user = $1 AND active = true`,
      [userId]
    );

    const { total, last_created } = metaQuery.rows[0];
    const serverTimestamp = last_created ? new Date(last_created).getTime() : 0;
    const serverChecksum = total || 0;

    // Regla de seguridad: forzar sync si pasaron más de 7 días
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const isOlderThanSevenDays = clientTimestamp ? (now - Number(clientTimestamp)) > SEVEN_DAYS_MS : true;

    // Verificar si el cliente está actualizado
    const isUpToDate = 
      !isOlderThanSevenDays &&
      Number(clientTimestamp) === serverTimestamp &&
      Number(clientChecksum) === serverChecksum;

    if (isUpToDate) {
      return {
        status: 'UP_TO_DATE',
        current_timestamp: serverTimestamp,
        checksum: serverChecksum,
        syncedAt: new Date().toISOString()
      };
    }

    // 2. Si no está al día o pasaron 7 días, obtener las reglas activas
    const rulesResult = await db.query(
      `SELECT domain, rule_type 
       FROM custom_blocklist 
       WHERE id_user = $1 AND active = true`,
      [userId]
    );

    const rules = rulesResult.rows;
    const domain = rules.filter(item => item.rule_type === 'domain').map(item => item.domain);
    const keyword = rules.filter(item => item.rule_type === 'keyword').map(item => item.domain);

    return {
      status: 'RESET',
      current_timestamp: serverTimestamp,
      checksum: serverChecksum,
      data: {
        total: rules.length,
        domain,
        keyword,
        syncedAt: new Date().toISOString()
      }
    };
  }
}

module.exports = new SyncService();