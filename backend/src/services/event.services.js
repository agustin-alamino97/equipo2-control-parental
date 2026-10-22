const db = require('../config/db');
const notificationService = require('./notifications/notification.services');

// ============================================================================
// FUNCIONES AUXILIARES Y LÓGICA DE NEGOCIO
// ============================================================================

/**
 * Evalúa si un tipo de evento requiere la generación de alerta crítica.
 * @param {string} tipoEvento - Identificador del tipo de evento.
 * @returns {boolean} True si el evento es de carácter crítico.
 */
const esCritico = (tipoEvento) => {
  const eventosCriticos = ['uninstall_attempt', 'lotba', 'score_exceeded', 'os_permission_change'];
  return eventosCriticos.includes(tipoEvento);
};

/**
 * Determina el nivel de severidad asignado para la tabla 'alerts'.
 * @param {string} tipoEvento - Tipo de evento registrado.
 * @returns {'critical' | 'warning' | 'info'} Nivel de severidad para el ENUM de BD.
 */
const obtenerSeveridad = (tipoEvento) => {
  switch (tipoEvento) {
    case 'lotba':
    case 'uninstall_attempt':
      return 'critical';
    case 'score_exceeded':
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
 * Inserta un único evento en base de datos de manera transaccional.
 * Crea el registro en 'alerts' si el evento es calificado como crítico.
 * @param {Object} eventData - Payload validado del evento.
 */
const createSingleEvent = async (eventData) => {
  const { device_uuid, event_type, url, detail, event_time } = eventData;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Obtener ID interno del dispositivo mediante device_uuid
    const deviceResult = await client.query(
      'SELECT id, alias_name FROM devices WHERE device_uuid = $1',
      [device_uuid]
    );

    if (deviceResult.rows.length === 0) {
      throw new Error('DEVICE_NOT_FOUND');
    }

    const device = deviceResult.rows[0];

    // 2. Registrar evento en la tabla 'protection_events'
    const eventQuery = `
      INSERT INTO protection_events (id_device, event_type, url, detail, event_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const eventValues = [
      device.id,
      event_type,
      url || null,
      JSON.stringify(detail || {}),
      event_time || new Date()
    ];

    const eventResult = await client.query(eventQuery, eventValues);
    const createdEvent = eventResult.rows[0];

    // 3. Crear registro en 'alerts' si aplica severidad
    let createdAlert = null;
    if (esCritico(event_type)) {
      const { title } = construirMensajeNotificacion(event_type, device.alias_name, url);
      const severidad = obtenerSeveridad(event_type);

      // Importante: $2::enum_alert_severity realiza el casteo explícito al ENUM de Postgres
      const alertQuery = `
        INSERT INTO alerts (id_event, severity, message, read, alert_time)
        VALUES ($1, $2::enum_alert_severity, $3, false, $4)
        RETURNING *
      `;
      
      const alertResult = await client.query(alertQuery, [
        createdEvent.id,
        severidad,
        title,
        createdEvent.event_time
      ]);
      
      createdAlert = alertResult.rows[0];
    }

    await client.query('COMMIT');

    // 4. Despacho asincrónico de notificaciones Push (No bloqueante)
    try {
      procesarAlertaSiCorresponde(createdEvent, device.id).catch(err => {
        console.error('[Push Notification Error]:', err.message);
      });
    } catch (pushErr) {
      console.error('[Push Notification Sync Error]:', pushErr.message);
    }

    return {
      ...createdEvent,
      es_critico: esCritico(createdEvent.event_type),
      alert: createdAlert
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
      pe.url,
      pe.detail,
      pe.event_time
    FROM protection_events pe
    INNER JOIN devices d ON pe.id_device = d.id
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
    es_critico: esCritico(event.event_type)
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
      a.id AS alert_id,
      a.severity,
      a.message,
      a.read,
      a.alert_time,
      pe.id AS event_id,
      pe.event_type,
      pe.url,
      pe.detail,
      pe.event_time,
      d.id AS device_id,
      d.alias_name,
      d.device_uuid
    FROM alerts a
    JOIN protection_events pe ON a.id_event = pe.id
    JOIN devices d ON pe.id_device = d.id
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
    JOIN devices d ON pe.id_device = d.id
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