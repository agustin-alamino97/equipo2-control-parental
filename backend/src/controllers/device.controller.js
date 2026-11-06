const deviceService = require('../services/device.services');

// ============================================================================
// CONTROLADOR DE GESTIÓN DE DISPOSITIVOS
// ============================================================================

/**
 * Consulta la lista de dispositivos asignados al tutor en sesión.
 * @route GET /api/devices
 */
const getDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    const devices = await deviceService.getDevicesByUser(userId);
    return res.status(200).json({ devices });
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    return res.status(500).json({ error: 'Error interno al obtener dispositivos' });
  }
};

/**
 * Desvincula un dispositivo del tutor (revoca credencial y cambia estado a no vinculado).
 */
const requestUnlink = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id; // Asumiendo que viene del authMiddleware del tutor

    const result = await deviceService.initiateUnlink(deviceId, userId);
    return res.status(200).json({
      success: true,
      message: 'Proceso de desvinculación iniciado.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const confirmDeviceUnlink = async (req, res, next) => {
  try {
    // El deviceId se extrae del token del dispositivo autenticado, no de la URL
    const deviceId = req.device.id; // (Ajusta según cómo guardes el device en tu authMiddleware)

    const result = await deviceService.confirmUnlink(deviceId);
    return res.status(200).json({
      success: true,
      message: 'Dispositivo desvinculado exitosamente.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevices,
  requestUnlink,
  confirmDeviceUnlink
};