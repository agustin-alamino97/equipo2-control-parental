const db = require('../config/db');

// ============================================================================
// SERVICIOS DE GESTIÓN DE DISPOSITIVOS
// ============================================================================
  
const getDevicesByUser = async (userId) => {
  const result = await db.query(
    'SELECT * FROM devices WHERE id_user = $1 ORDER BY creation_time DESC',
    [userId]
  );
  return result.rows;
};

/**
 * Desvincula un dispositivo del tutor (revoca credenciales y apaga el flag de vinculación).
 */
const unlinkDevice = async (deviceId, userId) => {
  const result = await db.query(
    `UPDATE devices 
      SET linked = false,
          protection_status = false,
          device_token = NULL, 
          push_token = NULL 
      WHERE id = $1 AND id_user = $2 AND linked = true
      RETURNING id, alias_name, linked, protection_status`,
    [deviceId, userId]
  );

  // Si no actualizó ninguna fila, es porque no existe, no es de este tutor o ya estaba desvinculado
  if (result.rows.length === 0) {
    throw new Error('DEVICE_NOT_FOUND_OR_ALREADY_UNLINKED');
  }

  return result.rows[0];
};

module.exports = {
  getDevicesByUser,
  unlinkDevice,
};