const db = require('../config/db');
const notificationService = require('./notifications/notification.services');
const { normalizeValue } = require('../utils/normalizeDomains');

// ============================================================================
// FUNCIONES AUXILIARES Y LÓGICA DE NEGOCIO
// ============================================================================

/**
 * Evalúa si un evento registrado se considera crítico para la vista del tutor.
 * @param {string} eventType - Tipo de evento ('domain', 'uninstall_attempt', etc.)
 * @param {string|null} actionSlug - Acción asociada ('block', 'alert', 'allow', etc.)
 * @returns {boolean} True si el evento es de carácter crítico.
 */
const esCritico = (eventType, actionSlug = null) => {
  // 1. Si la regla aplicada derivó en un bloqueo, siempre es crítico
  if (actionSlug === 'block') {
    return true;
  }

  // 2. Si es un evento de seguridad/telemetría del dispositivo
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
 * @param {string} tipoEvento - Tipo de evento registrado.
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
 * @param {string} tipoEvento - Identificador del evento.
 * @param {string} aliasDispositivo - Nombre descriptivo del dispositivo del menor.
 * @param {string|null} url - Dirección web asociada (si aplica).
 * @returns {{title: string, body: string}}
 */
const construirMensajeNotificacion = (tipoEvento, aliasDispositivo, url) => {
  switch (tipoEvento) {
    case 'lotba':
      return {
        title: `🚨 Alerta de Apuestas en ${aliasDispositivo}`,
        body: `Se detectó e interrumpió un intento de acceso a sitio de apuestas${url ? `: ${url}` : '.'}`
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
 * @param {Object} evento - Objeto de evento registrado en BD.
 * @param {string} deviceId - UUID interno del dispositivo en la base de datos.
 */
const procesarAlertaSiCorresponde = async (evento, deviceId) => {
  if (!esCritico(evento.event_type)) {
    return null;
  }

  // Obtener push_tokens activos del tutor asociado al dispositivo
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
  const { title, body } = construirMensajeNotificacion(evento.event_type, aliasDispositivo, evento.url);

  // Enviar push a cada sesión activa
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

/**
 * Procesa y registra un evento individual de forma idempotente.
 * @param {Object} eventData - Datos del evento enviados por el cliente.
 */
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

    // 3. Determinar si el evento requiere búsqueda en blocklists o es de sistema/seguridad
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
      // Si ya existía (por un reintento del móvil), lo recuperamos de la BD 
      // para responder con éxito sin duplicar registros ni alertas.
      const existingEventRes = await client.query(
        'SELECT * FROM protection_events WHERE id_device = $1 AND client_event_id = $2',
        [device.id, client_event_id]
      );
      createdEvent = existingEventRes.rows[0];
    }

    // 5. Gestión de Alertas (Solo si es un evento nuevo para evitar duplicar alertas en reintentos)
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

    // 6. Obtener nombres legibles para la respuesta utilizando los IDs del evento
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

    // Confirmamos la transacción atómica completa
    await client.query('COMMIT');

    // Despacho asincrónico de notificaciones Push solo si se generó una alerta nueva
    if (createdAlert) {
      try {
        procesarAlertaSiCorresponde(createdEvent, device.id).catch(err => {
          console.error('[Push Notification Error]:', err.message);
        });
      } catch (pushErr) {
        console.error('[Push Notification Sync Error]:', pushErr.message);
      }
    }

    // Retornamos estructura limpia. Si era duplicado, alert_generated será false pero responderá con éxito.
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

/**
 * Punto de entrada público para procesar un evento individual o un lote (array).
 * @param {Object|Array} data - Objeto o arreglo de objetos validados por Zod.
 */
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

/**
 * Obtiene el historial de eventos pertenecientes a los dispositivos de un tutor.
 * @param {string} userId - UUID del tutor autenticado.
 * @param {string|null} filterDeviceId - ID de dispositivo opcional para filtrar.
 */
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
    es_critico: esCritico(event.event_type, event.action) // <-- Pasamos el slug de la acción ('block', etc.)
  }));
};

/**
 * Obtiene el listado de alertas generadas para la app del tutor.
 * @param {string} userId - UUID del tutor.
 * @param {Object} opciones - Filtros de consulta (soloNoLeidas, limite).
 */
const getAlertsForTutor = async (userId, { soloNoLeidas, limite = 20 } = {}) => {
  let query = `
    SELECT 
      a.id,
      a.id_event,
      pe.event_type,
      pe.value, -- <-- Asegúrate de usar value en lugar de url
      d.alias_name AS device_name,
      a.severity,
      a.message,
      a.read,
      a.alert_time
    FROM alerts a
    INNER JOIN protection_events pe ON a.id_event = pe.id
    INNER JOIN devices d ON pe.id_device = d.id
    WHERE d.id_user = $1
    -- ... tus filtros y ordenamientos
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

/**
 * Actualiza el estado de una alerta a leída asegurando propiedad del tutor.
 * @param {string} alertId - ID de la alerta a actualizar.
 * @param {string} userId - ID del tutor en sesión.
 */
const markAlertAsRead = async (alertId, userId) => {
  const query = `
    UPDATE alerts a
    SET read = true
    FROM protection_events pe
    JOIN devices d ON pe.idsw_device = d.id
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