const db = require('../config/db');
const notificationService = require('./notifications/notification.services');
const { normalizeValue } = require('../utils/normalizeDomains');

// ============================================================================
// FUNCIONES AUXILIARES Y LÓGICA DE NEGOCIO
// ============================================================================

/**
 * Evalúa si un evento registrado se considera crítico para la vista del tutor.
 * @param {string} eventType Tipo de evento ('domain', 'uninstall_attempt', etc.)
 * @param {string|null} actionSlug Acción asociada ('block', 'alert', 'allow', etc.)
 * @returns {boolean} True si el evento es de carácter crítico.
 */
const esCritico = (eventType, actionSlug = null) => {
  if (actionSlug === 'block') {
    return true;
  }

  const eventosSeguridadCriticos = [
    'uninstall_attempt',
    'app_install_attempt',
    'score_exceeded',
    'os_permission_change'
  ];

  return eventosSeguridadCriticos.includes(eventType);
};

/**
 * Determina el nivel de severidad asignado para la tabla 'alerts'.
 * @param {string} tipoEvento Tipo de evento registrado.
 * @returns {'critical' | 'warning' | 'info'} Nivel de severidad para el ENUM de BD.
 */
const obtenerSeveridad = (tipoEvento) => {
  switch (tipoEvento) {
    case 'system_blocklist':
    case 'uninstall_attempt':
      return 'critical';
    case 'app_install_attempt':
    case 'os_permission_change':
      return 'warning';
    default:
      return 'info';
  }
};

/**
 * Construye los textos descriptivos para las notificaciones y mensajes de alerta.
 * @param {string} tipoEvento Identificador del evento.
 * @param {string} aliasDispositivo Nombre descriptivo del dispositivo del menor.
 * @param {string|null} valorAsociado Dirección web o valor asociado (si aplica).
 * @returns {{title: string, body: string}}
 */
const construirMensajeNotificacion = (tipoEvento, aliasDispositivo, valorAsociado) => {
  switch (tipoEvento) {
    case 'lotba':
    case 'domain':
      return {
        title: `🚨 Alerta de Apuestas en ${aliasDispositivo}`,
        body: `Se detectó e interrumpió un intento de acceso a sitio restringido${valorAsociado ? `: ${valorAsociado}` : '.'}`
      };
    case 'uninstall_attempt':
      return {
        title: `⚠️ Intento de Desinstalación`,
        body: `Se intentó desinstalar la app de protección en el dispositivo de ${aliasDispositivo}.`
      };
    case 'score_exceeded':
      return {
        title: `🔴 Umbral de Riesgo Excedido`,
        body: `El nivel de riesgo acumulado en ${aliasDispositivo} superó el límite permitido.`
      };
    default:
      return {
        title: `🔔 Alerta de Protección en ${aliasDispositivo}`,
        body: `Se registró un evento de tipo: ${tipoEvento}`
      };
  }
};

/**
 * Consulta tokens Push activos del tutor y despacha notificaciones asincrónicas.
 * @param {Object} evento Objeto de evento registrado en BD.
 * @param {string} deviceId UUID interno del dispositivo en la base de datos.
 */
const procesarAlertaSiCorresponde = async (evento, deviceId) => {
  if (!esCritico(evento.event_type)) {
    return null;
  }

  const query = `
    SELECT us.push_token, d.alias_name
    FROM devices d
    INNER JOIN user_sessions us ON us.id_user = d.id_user
    WHERE d.id = $1 
      AND us.is_active = true 
      AND us.push_token IS NOT NULL
  `;

  const result = await db.query(query, [deviceId]);

  if (result.rows.length === 0) {
    return null;
  }

  const aliasDispositivo = result.rows[0].alias_name || 'Dispositivo Protegido';
  const { title, body } = construirMensajeNotificacion(evento.event_type, aliasDispositivo, evento.value);

  const notificacionesEnviadas = [];
  for (const row of result.rows) {
    const response = await notificationService.enviarNotificacion(row.push_token, {
      title,
      body,
      data: {
        eventId: evento.id,
        deviceId: deviceId,
        tipoEvento: evento.event_type,
        eventTime: evento.event_time
      }
    });
    notificacionesEnviadas.push(response);
  }

  return notificacionesEnviadas;
};

// ============================================================================
// REGISTRO Y PERSISTENCIA DE EVENTOS
// ============================================================================

const createSingleEvent = async (eventData) => {
  const { device_uuid, event_type, value, event_time, client_event_id } = eventData;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Obtener ID y alias del dispositivo mediante device_uuid
    const deviceResult = await client.query(
      'SELECT id, alias_name FROM devices WHERE device_uuid = $1',
      [device_uuid]
    );

    if (deviceResult.rows.length === 0) {
      throw new Error('DEVICE_NOT_FOUND');
    }
    const device = deviceResult.rows[0];

    // 2. Normalizar el valor recibido
    const normalizedValue = normalizeValue(event_type, value);

    let categoryId = null;
    let actionId = null;

    // 3. Determinar si el evento requiere búsqueda en blocklists
    const requiresBlocklistCheck = ['domain', 'keyword', 'regex'].includes(event_type);

    if (requiresBlocklistCheck) {
      const ruleQuery = `
        SELECT category_id, action_id FROM system_blocklist 
        WHERE active = true AND rule_type = $1 AND value = $2
        UNION
        SELECT category_id, action_id FROM custom_blocklist 
        WHERE active = true AND rule_type = $1 AND value = $2
        LIMIT 1;
      `;
      const ruleResult = await client.query(ruleQuery, [event_type, normalizedValue]);

      if (ruleResult.rows.length > 0) {
        categoryId = ruleResult.rows[0].category_id;
        actionId = ruleResult.rows[0].action_id;
      }
    }

    // 4. Registrar evento en la tabla 'protection_events' de forma idempotente
    let createdEvent = null;
    let isNewEvent = false;

    const eventQuery = `
      INSERT INTO protection_events (id_device, client_event_id, event_type, value, category_id, action_id, event_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id_device, client_event_id) DO NOTHING
      RETURNING *
    `;

    const eventValues = [
      device.id,
      client_event_id || null,
      event_type,
      normalizedValue,
      categoryId,
      actionId,
      event_time || new Date()
    ];

    const eventResult = await client.query(eventQuery, eventValues);

    if (eventResult.rows.length > 0) {
      createdEvent = eventResult.rows[0];
      isNewEvent = true;
    } else {
      const existingEventRes = await client.query(
        'SELECT * FROM protection_events WHERE id_device = $1 AND client_event_id = $2',
        [device.id, client_event_id]
      );
      createdEvent = existingEventRes.rows[0];
    }

    // 5. Gestión de Alertas
    let createdAlert = null;
    let severity = 'info';
    let message = '';

    if (isNewEvent) {
      let shouldAlert = false;

      if (requiresBlocklistCheck && actionId) {
        const actionDetails = await client.query('SELECT slug FROM actions WHERE id = $1', [actionId]);
        const actionSlug = actionDetails.rows[0]?.slug;

        if (actionSlug === 'block' || actionSlug === 'alert') {
          shouldAlert = true;
          severity = actionSlug === 'block' ? 'critical' : 'warning';
          message = `Infracción detectada (${event_type}) en ${normalizedValue} para el dispositivo ${device.alias_name}`;
        }
      } else if (!requiresBlocklistCheck) {
        shouldAlert = true;
        severity = obtenerSeveridad(event_type);
        message = `Alerta de seguridad (${event_type}) en el dispositivo ${device.alias_name}: ${normalizedValue}`;
      }

      if (shouldAlert) {
        const alertQuery = `
          INSERT INTO alerts (id_event, severity, message, read, alert_time)
          VALUES ($1, $2::enum_alert_severity, $3, false, $4)
          RETURNING *
        `;
        
        const alertResult = await client.query(alertQuery, [
          createdEvent.id,
          severity,
          message,
          createdEvent.event_time
        ]);
        
        createdAlert = alertResult.rows[0];
      }
    }

    // 6. Obtener nombres legibles para la respuesta
    let categoryName = null;
    let actionSlug = null;

    if (createdEvent.category_id) {
      const catRes = await client.query('SELECT name FROM categories WHERE id = $1', [createdEvent.category_id]);
      categoryName = catRes.rows[0]?.name || null;
    }

    if (createdEvent.action_id) {
      const actRes = await client.query('SELECT slug FROM actions WHERE id = $1', [createdEvent.action_id]);
      actionSlug = actRes.rows[0]?.slug || null;
    }

    await client.query('COMMIT');

    if (createdAlert) {
      try {
        procesarAlertaSiCorresponde(createdEvent, device.id).catch(err => {
          console.error('[Push Notification Error]:', err.message);
        });
      } catch (pushErr) {
        console.error('[Push Notification Sync Error]:', pushErr.message);
      }
    }

    return {
      id: createdEvent.id,
      event_type: createdEvent.event_type,
      value: createdEvent.value,
      category: categoryName,
      action: actionSlug,
      event_time: createdEvent.event_time,
      alert_generated: !!createdAlert
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const registrarEvento = async (data) => {
  if (Array.isArray(data)) {
    const results = [];
    for (const singleData of data) {
      const inserted = await createSingleEvent(singleData);
      results.push(inserted);
    }
    return results;
  }

  return await createSingleEvent(data);
};

// ============================================================================
// CONSULTAS PARA LA APLICACIÓN DEL TUTOR
// ============================================================================

const getEventsByTutor = async (userId, filterDeviceId = null) => {
  let query = `
    SELECT 
      pe.id,
      pe.id_device,
      d.alias_name,
      d.os_model,
      pe.event_type,
      pe.value,
      c.name AS category,
      a.slug AS action,
      pe.event_time
    FROM protection_events pe
    INNER JOIN devices d ON pe.id_device = d.id
    LEFT JOIN categories c ON pe.category_id = c.id
    LEFT JOIN actions a ON pe.action_id = a.id
    WHERE d.id_user = $1
  `;

  const queryParams = [userId];

  if (filterDeviceId) {
    query += ` AND d.id = $2`;
    queryParams.push(filterDeviceId);
  }

  query += ` ORDER BY pe.event_time DESC`;

  const result = await db.query(query, queryParams);

  return result.rows.map(event => ({
    ...event,
    es_critico: esCritico(event.event_type, event.action)
  }));
};

const getAlertsForTutor = async (userId, { soloNoLeidas, limite = 20 } = {}) => {
  let query = `
    SELECT 
      a.id,
      a.id_event,
      pe.event_type,
      pe.value,
      d.alias_name AS device_name,
      a.severity,
      a.message,
      a.read,
      a.alert_time
    FROM alerts a
    INNER JOIN protection_events pe ON a.id_event = pe.id
    INNER JOIN devices d ON pe.id_device = d.id
    WHERE d.id_user = $1
  `;

  const queryParams = [userId];

  if (soloNoLeidas === 'true') {
    queryParams.push(false);
    query += ` AND a.read = $${queryParams.length}`;
  }

  query += ` ORDER BY a.alert_time DESC LIMIT $${queryParams.length + 1}`;
  queryParams.push(limite);

  const { rows } = await db.query(query, queryParams);
  return rows;
};

const markAlertAsRead = async (alertId, userId) => {
  const query = `
    UPDATE alerts a
    SET read = true
    FROM protection_events pe
    JOIN devices d ON pe.id_device = d.id -- <--- CORREGIDO: id_device en lugar de idsw_device
    WHERE a.id_event = pe.id 
      AND a.id = $1 
      AND d.id_user = $2
    RETURNING a.id, a.read;
  `;
  const { rows } = await db.query(query, [alertId, userId]);
  return rows[0];
};

module.exports = {
  registrarEvento,
  getEventsByTutor,
  getAlertsForTutor,
  markAlertAsRead
};