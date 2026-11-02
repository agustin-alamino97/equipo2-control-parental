const cron = require('node-cron');
const db = require('../config/db');

/**
 * Elimina códigos de emparejamiento usados o expirados de la base de datos.
 */
const cleanExpiredPairingCodes = async () => {
  try {
    const result = await db.query(
      `DELETE FROM pairing_codes 
       WHERE used = true 
          OR expires_at < NOW() - INTERVAL '1 day'`
    );
    console.log(`[CRON] Limpieza de pairing_codes completada. Registros eliminados: ${result.rowCount}`);
  } catch (error) {
    console.error('[CRON Error] Error al limpiar pairing_codes:', error);
  }
};

/**
 * Inicializa el trabajo programado (Cron Job) en segundo plano.
 * Se ejecuta automáticamente todos los días a las 03:00 AM.
 */
const initScheduledJobs = () => {
  cron.schedule('0 3 * * *', () => {
    console.log('[CRON] Ejecutando mantenimiento de base de datos...');
    cleanExpiredPairingCodes();
  });
};

module.exports = {
  initScheduledJobs,
  cleanExpiredPairingCodes
};