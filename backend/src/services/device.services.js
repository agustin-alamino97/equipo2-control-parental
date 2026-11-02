const db = require('../config/db');
const notificationService = require('./notifications/notification.services');

// ============================================================================
// SERVICIOS DE GESTIÓN DE DISPOSITIVOS
// ============================================================================
  
const getDevicesByUser = async (userId) => {
  const result = await db.query(
    `SELECT 
       id,
       device_uuid,
       alias_name,
       os_model,
       protection_status,
       linked,
       last_ping,
       creation_time
     FROM devices 
     WHERE id_user = $1 
     ORDER BY creation_time ASC`,
    [userId]
  );
  return result.rows;
};

/**
 * Desvincula un dispositivo del tutor (revoca credenciales y apaga el flag de vinculación).
 */
const unlinkDevice = async (deviceId, userId) => {
  // 1. Desvinculamos en la BD y recuperamos el push_token que tenía asignado
  const result = await db.query(
    `UPDATE devices 
      SET linked = false,
          protection_status = false,
          device_token = NULL, 
          push_token = NULL 
      WHERE id = $1 AND id_user = $2 AND linked = true
      RETURNING id, alias_name, linked, protection_status, push_token`,
    [deviceId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('DEVICE_NOT_FOUND_OR_ALREADY_UNLINKED');
  }

  const updatedDevice = result.rows[0];
  const oldPushToken = updatedDevice.push_token;

  // 2. Si el dispositivo tenía un push token, disparamos el push silencioso
  if (oldPushToken) {
    await notificationService.sendSilentPush({
      pushTokens: oldPushToken,
      payload: {
        action: 'FORCE_UNLINK',
        device_id: updatedDevice.id
      }
    });
  }

  // 3. Retornamos los datos limpios al controlador
  return {
    id: updatedDevice.id,
    alias_name: updatedDevice.alias_name,
    linked: updatedDevice.linked,
    protection_status: updatedDevice.protection_status
  };
};

module.exports = {
  getDevicesByUser,
  unlinkDevice,
};