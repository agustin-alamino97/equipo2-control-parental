const db = require('../config/db');
const notificationService = require('./notifications/notification.services');

const getDevicesByUser = async (userId) => {
  const result = await db.query(
    `SELECT 
       id,
       device_uuid,
       alias_name,
       os_model,
       protection_status,
       status,
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
 * 1. El tutor inicia la desvinculación: pasa a 'pending' y envía push silencioso.
 */
const initiateUnlink = async (deviceId, userId) => {
  const result = await db.query(
    `UPDATE devices 
       SET status = 'pending'
     WHERE id = $1 AND id_user = $2 AND status = 'linked'
     RETURNING id, alias_name, status, push_token`,
    [deviceId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('DEVICE_NOT_FOUND_OR_NOT_LINKED');
  }

  const updatedDevice = result.rows[0];

  if (updatedDevice.push_token) {
    await notificationService.sendSilentPush({
      pushTokens: updatedDevice.push_token,
      payload: {
        action: 'FORCE_UNLINK',
        device_id: updatedDevice.id
      }
    });
  }

  return {
    id: updatedDevice.id,
    alias_name: updatedDevice.alias_name,
    status: updatedDevice.status
  };
};

/**
 * 2. La app del protegido confirma que ejecutó la baja localmente.
 */
const confirmUnlink = async (deviceId) => {
  const result = await db.query(
    `UPDATE devices 
       SET status = 'unlinked',
           protection_status = false,
           device_token = NULL,
           push_token = NULL 
     WHERE id = $1 AND status = 'pending'
     RETURNING id, status`,
    [deviceId]
  );

  if (result.rows.length === 0) {
    throw new Error('DEVICE_NOT_FOUND_OR_NOT_IN_PENDING');
  }

  return {
    id: result.rows[0].id,
    status: result.rows[0].status
  };
};

module.exports = {
  getDevicesByUser,
  initiateUnlink,
  confirmUnlink
};