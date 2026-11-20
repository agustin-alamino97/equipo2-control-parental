const db = require('../config/db');
const notificationService = require('./notifications/notification.services');
const { normalizeValue } = require('../utils/normalizeDomains');

// Constante unificada para el checksum de listas vacías
const EMPTY_CHECKSUM = 'd41d8cd98f00b204e9800998ecf8427e';

class SyncService {
  async getSystemRules({ clientVersion, clientChecksum }) {
  // 1. Obtenemos el conteo, la versión máxima y el hash de contenido en una sola query optimizada
  // Usamos md5() que viene nativo en PostgreSQL (no requiere extensiones como pgcrypto)
  const metaQuery = await db.query(`
    SELECT 
        COUNT(*)::int as total, 
        COALESCE(MAX(version_id), MAX(id), 0) as max_version,
        COALESCE(md5(string_agg(value, ',' ORDER BY id ASC)), $1) as content_hash
      FROM system_blocklist 
      WHERE active = true
    `, [EMPTY_CHECKSUM]);

  const { total, max_version, content_hash } = metaQuery.rows[0];

  const serverVersion = max_version; 
  const serverChecksum = content_hash; // El checksum ahora es un hash alfanumérico (ej: 'd41d8cd98f00b204e9800998ecf8427e')

  // 2. Doble verificación estricta: versión numérica y checksum de contenido deben coincidir
  const isUpToDate = 
    Number(clientVersion) === serverVersion && 
    clientChecksum === serverChecksum; // Comparación de strings exactos

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
    `SELECT value, rule_type FROM system_blocklist WHERE active = true`
  );

  const rules = rulesResult.rows;

  const domain = rules.filter(item => item.rule_type === 'domain').map(item => item.value);
  const keyword = rules.filter(item => item.rule_type === 'keyword').map(item => item.value);
  const regex = rules.filter(item => item.rule_type === 'regex').map(item => item.value);

  return {
    status: 'RESET',
    //current_version: serverVersion,
    //checksum: serverChecksum,
    data: {
        total: rules.length,
        domain,
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
      `SELECT id, value, rule_type, creation_time 
       FROM custom_blocklist 
       WHERE id_user = $1 AND active = true
       ORDER BY creation_time DESC`,
      [userId]
    );

    const rules = rulesResult.rows;

    // Estructuramos por tipo pero incluyendo el id y el valor para la tabla del tutor
    const domain = rules
      .filter(item => item.rule_type === 'domain')
      .map(item => ({ id: item.id, value: item.value }));
      
    const keyword = rules
      .filter(item => item.rule_type === 'keyword')
      .map(item => ({ id: item.id, value: item.value }));

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
  async addCustomRuleForUser({ userId, value, ruleType }) {
    const ALLOWED_TYPES = ['domain', 'keyword']; 

    if (!ALLOWED_TYPES.includes(ruleType)) {
      const error = new Error(`El tipo de regla '${ruleType}' no está permitido.`);
      error.statusCode = 400;
      throw error;
    }

    const cleanvalue = normalizeValue(ruleType, value);

    try {
      const query = `
        INSERT INTO custom_blocklist (id_user, value, rule_type, active, creation_time)
        VALUES ($1, $2, $3, true, NOW())
        ON CONFLICT (id_user, value) 
        DO UPDATE SET 
          active = true, 
          rule_type = EXCLUDED.rule_type, 
          creation_time = NOW()
        RETURNING id, value, rule_type, creation_time;
      `;

      const result = await db.query(query, [userId, cleanvalue, ruleType]);
      const createdRule = result.rows[0];

      // Disparar Silent Push
      await this._notifyDevices(userId, createdRule.creation_time);

      return {
        success: true,
        message: 'Regla agregada o actualizada correctamente',
        data: createdRule
      };
    } catch (dbError) {
      if (dbError.code === '23505') {
        const error = new Error('Ya existe una regla registrada con ese mismo valor para este usuario.');
        error.statusCode = 400;
        throw error;
      }
      throw dbError;
    }
  }

  /**
   * Actualiza una regla personalizada existente por su ID.
   */
  async updateCustomRuleForUser({ userId, ruleId, value, ruleType }) {
    const ALLOWED_TYPES = ['domain', 'keyword']; 

    if (ruleType && !ALLOWED_TYPES.includes(ruleType)) {
      const error = new Error(`El tipo de regla '${ruleType}' no está permitido.`);
      error.statusCode = 400;
      throw error;
    }

    const cleanValue = value ? normalizeValue(ruleType || 'domain', value) : null;

    try {
      // Actualizamos asegurando que la regla pertenezca al tutor autenticado
      const query = `
        UPDATE custom_blocklist
        SET 
          value = COALESCE($1, value),
          rule_type = COALESCE($2, rule_type),
          creation_time = NOW()
        WHERE id = $3 AND id_user = $4 AND active = true
        RETURNING id, value, rule_type, creation_time;
      `;

      const result = await db.query(query, [cleanValue, ruleType, ruleId, userId]);

      if (result.rows.length === 0) {
        const error = new Error('Regla no encontrada o no pertenece al usuario.');
        error.statusCode = 404;
        throw error;
      }

      const updatedRule = result.rows[0];

      // Disparar Silent Push
      await this._notifyDevices(userId, updatedRule.creation_time);

      return {
        success: true,
        message: 'Regla actualizada correctamente',
        data: updatedRule
      };

    } catch (dbError) {
      // Código PostgreSQL para violación de unique constraint
      if (dbError.code === '23505') {
        const error = new Error('Ya existe otra regla registrada con ese mismo valor para este usuario.');
        error.statusCode = 400; // Bad Request controlado
        throw error;
      }
      throw dbError; // Si es otro error de base de datos, lo dejamos propagar
    }
  }

  /**
   * Elimina (soft delete) una regla personalizada por su ID.
   */
  async deleteCustomRuleForUser({ userId, ruleId }) {
    // Soft delete: cambiamos active a false y actualizamos el creation_time para invalidar cachés
    const query = `
      UPDATE custom_blocklist
      SET 
        active = false,
        creation_time = NOW()
      WHERE id = $1 AND id_user = $2 AND active = true
      RETURNING id, creation_time;
    `;

    const result = await db.query(query, [ruleId, userId]);

    if (result.rows.length === 0) {
      const error = new Error('Regla no encontrada o ya se encuentra inactiva.');
      error.statusCode = 404;
      throw error;
    }

    const deletedRule = result.rows[0];

    // Disparar Silent Push
    await this._notifyDevices(userId, deletedRule.creation_time);

    return {
      success: true,
      message: 'Regla eliminada correctamente',
      data: { id: deletedRule.id }
    };
  }

  /**
   * Método auxiliar privado para notificar vía Silent Push a los dispositivos vinculados.
   */
  async _notifyDevices(userId, timestampRef) {
    try {
      const devicesQuery = await db.query(
        `SELECT push_token 
         FROM devices 
         WHERE id_user = $1 AND status = 'linked' AND push_token IS NOT NULL`,
        [userId]
      );

      const pushTokens = devicesQuery.rows.map(d => d.push_token);

      if (pushTokens.length > 0) {
        await notificationService.sendSilentPush({
          pushTokens,
          payload: {
            action: 'RELOAD_CUSTOM_RULES',
            tutorUserId: userId,
            timestamp: new Date(timestampRef).getTime()
          }
        });
      }
    } catch (pushError) {
      console.error('[SYNC SERVICE] Error no bloqueante al enviar Silent Push:', pushError.message);
    }
  }


  /**
   * Sincronización de reglas personalizadas para dispositivos protegidos.
   * Valida la identidad del dispositivo (device_token + device_uuid) y aplica
   * la doble verificación por timestamp, checksum y regla de seguridad de 7 días.
   */
  async getCustomRulesForDevice({ userId, clientTimestamp, clientChecksum }) {
    // 1. PRE-CHEOUEO: Verificamos rápidamente si el tutor tiene reglas activas
    const countQuery = await db.query(
      `SELECT COUNT(*)::int as total FROM custom_blocklist WHERE id_user = $1 AND active = true`,
      [userId]
    );
    
    const totalRules = countQuery.rows[0].total;

    // Si la lista está totalmente vacía, respondemos de inmediato sin tocar string_agg
    if (totalRules === 0) {
      const serverTimestamp = 0;
      const serverChecksum = EMPTY_CHECKSUM;

      // Evaluamos si el cliente ya sabía que estaba vacío
      const isUpToDate = Number(clientTimestamp) === serverTimestamp && clientChecksum === serverChecksum;

      if (isUpToDate) {
        return {
          status: 'UP_TO_DATE',
          current_timestamp: serverTimestamp,
          checksum: serverChecksum,
          syncedAt: new Date().toISOString()
        };
      }

      return {
        status: 'RESET',
        current_timestamp: serverTimestamp,
        checksum: serverChecksum,
        data: {
          total: 0,
          domain: [],
          keyword: [],
          syncedAt: new Date().toISOString()
        }
      };
    } 
    
    // 2. Si hay reglas activas, obtenemos el timestamp y checksum de la lista actual
    const metaQuery = await db.query(
      `SELECT 
         MAX(creation_time) as last_created,
         COALESCE(md5(string_agg(value, ',' ORDER BY id ASC)), $1) as content_hash
       FROM custom_blocklist 
       WHERE id_user = $2 AND active = true`,
      [EMPTY_CHECKSUM, userId]
    );

    const { last_created, content_hash } = metaQuery.rows[0];
    const serverTimestamp = last_created ? new Date(last_created).getTime() : 0;
    const serverChecksum = content_hash;

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const isOlderThanSevenDays = clientTimestamp ? (now - Number(clientTimestamp)) > SEVEN_DAYS_MS : true;

    const isUpToDate = 
      !isOlderThanSevenDays &&
      Number(clientTimestamp) === serverTimestamp &&
      clientChecksum === serverChecksum;

    if (isUpToDate) {
      return {
        status: 'UP_TO_DATE',
        current_timestamp: serverTimestamp,
        checksum: serverChecksum,
        syncedAt: new Date().toISOString()
      };
    }

    const rulesResult = await db.query(
      `SELECT value, rule_type 
        FROM custom_blocklist 
        WHERE id_user = $1 AND active = true`,
      [userId]
    );

    const rules = rulesResult.rows;
    
    // Estandarizado a 'domain'
    const domain = rules.filter(item => item.rule_type === 'domain').map(item => item.value);
    const keyword = rules.filter(item => item.rule_type === 'keyword').map(item => item.value);

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