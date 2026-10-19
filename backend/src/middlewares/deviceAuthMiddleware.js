const db = require('../config/db');

/**
 * Middleware para validar la credencial revocable enviada desde el dispositivo protegido.
 * Realiza validación cruzada entre el 'device_token' (header) y el 'device_uuid' (body/payload).
 */
const deviceAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Credencial de dispositivo no provista' });
  }

  const deviceToken = authHeader.split(' ')[1];

  // Extraer el device_uuid que viene en la petición (soporta objeto único o batch/arreglo)
  const payloadUuid = Array.isArray(req.body) 
    ? req.body[0]?.device_uuid 
    : req.body?.device_uuid;

  if (!payloadUuid) {
    return res.status(400).json({ error: 'El campo device_uuid es requerido en el cuerpo de la petición' });
  }

  try {
    // 1. Buscar el dispositivo por su token
    const result = await db.query(
      'SELECT id, id_user, device_uuid, linked FROM devices WHERE device_token = $1',
      [deviceToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credencial de dispositivo inválida o no registrada' });
    }

    const device = result.rows[0];

    // 2. Verificar que el dispositivo no esté desvinculado
    if (!device.linked) {
      return res.status(403).json({ error: 'El dispositivo ha sido desvinculado o revocado' });
    }

    // 3. VALIDACIÓN CRUZADA: El device_uuid del token debe coincidir con el device_uuid enviado
    if (device.device_uuid !== payloadUuid) {
      return res.status(403).json({ 
        error: 'Inconsistencia de seguridad: El token provisto no pertenece al device_uuid especificado' 
      });
    }

    // Inyectamos el dispositivo autenticado en la request para uso del controlador
    req.device = device;
    next();
  } catch (error) {
    console.error('Error en deviceAuthMiddleware:', error);
    return res.status(500).json({ error: 'Error interno de autenticación de dispositivo' });
  }
};

module.exports = deviceAuthMiddleware;