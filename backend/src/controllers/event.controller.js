const eventService = require('../services/event.services');
const { reportEventSchema } = require('../schemas/event.schema');

// ============================================================================
// CONTROLADOR DE EVENTOS DE PROTECCIÓN Y ALERTAS
// ============================================================================

/**
 * Recibe y procesa uno o más eventos de protección desde la app móvil.
 * @route POST /api/events
 */
const recibirEvento = async (req, res) => {
  try {
    const validatedData = reportEventSchema.parse(req.body);
    const authenticatedDevice = req.device;

    const eventDataWithDevice = Array.isArray(validatedData)
      ? validatedData.map(ev => ({ ...ev, device_uuid: authenticatedDevice.device_uuid }))
      : { ...validatedData, device_uuid: authenticatedDevice.device_uuid };

    const result = await eventService.registrarEvento(eventDataWithDevice);

    return res.status(201).json({
      message: Array.isArray(result) 
        ? `${result.length} eventos registrados con éxito` 
        : 'Evento registrado con éxito',
      event: result 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.issues?.[0]?.message || 'Datos de evento inválidos' });
    }
    if (error.message === 'DEVICE_NOT_FOUND') {
      return res.status(404).json({ error: 'Dispositivo no encontrado o no vinculado' });
    }
    console.error('Error al recibir evento:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Consulta el historial de eventos para la vista del tutor.
 * Permite filtrado opcional por dispositivo mediante query param (`?deviceId=...`).
 * @route GET /api/events
 */
const getEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceId } = req.query;

    const events = await eventService.getEventsByTutor(userId, deviceId);

    return res.status(200).json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Error al consultar eventos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene las alertas críticas/advertencias para la app del tutor.
 * @route GET /api/events/alerts
 */
const getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { soloNoLeidas, limite } = req.query;

    const alerts = await eventService.getAlertsForTutor(userId, { soloNoLeidas, limite });
    
    return res.status(200).json({
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return res.status(500).json({ error: 'Error interno al consultar alertas' });
  }
};

/**
 * Marca una alerta específica como leída por el tutor.
 * @route PATCH /api/events/alerts/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updatedAlert = await eventService.markAlertAsRead(id, userId);

    if (!updatedAlert) {
      return res.status(404).json({ error: 'Alerta no encontrada o no pertenece al tutor' });
    }

    return res.status(200).json({
      message: 'Alerta marcada como leída',
      alert: updatedAlert
    });
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    return res.status(500).json({ error: 'Error interno al actualizar la alerta' });
  }
};

module.exports = {
  recibirEvento,
  getEvents,
  getAlerts,
  markAsRead
};