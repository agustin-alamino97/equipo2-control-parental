const deviceService = require('../services/device.service');

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
const unlinkDevice = async (req, res) => {
  try {
    const { id } = req.id || req.params; // Tomamos el id de los parámetros de la ruta
    const userId = req.user.id;         // El ID del tutor obtenido del token JWT

    const unlinkedDevice = await deviceService.unlinkDevice(id, userId);

    return res.status(200).json({
      message: 'Dispositivo desvinculado y credencial revocada con éxito',
      device: unlinkedDevice
    });
  } catch (error) {
    if (error.message === 'DEVICE_NOT_FOUND_OR_ALREADY_UNLINKED') {
      return res.status(404).json({ 
        error: 'El dispositivo no existe, no pertenece a este tutor o ya se encuentra desvinculado' 
      });
    }

    console.error('Error al desvincular dispositivo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getDevices,
  unlinkDevice
};