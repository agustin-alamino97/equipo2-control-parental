const deviceService = require('../services/device.services');

// ============================================================================
// CONTROLADOR DE GESTIÓN DE DISPOSITIVOS
// ============================================================================

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

const requestUnlink = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

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
    // Obtenemos el ID del dispositivo autenticado de forma segura mediante el middleware
    const deviceId = req.device.id;

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