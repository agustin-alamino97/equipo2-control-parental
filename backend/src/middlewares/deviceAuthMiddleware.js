const db = require('../config/db');

/**
 * Middleware para validar la credencial revocable enviada desde el dispositivo protegido.
 * @param {Array<string>} allowedStatuses - Estados permitidos para acceder a la ruta (por defecto ['linked']).
 */
const deviceAuthMiddleware = (allowedStatuses = ['linked']) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Credencial de dispositivo no provista' });
  }

  const deviceToken = authHeader.split(' ')[1];

  // Extracción orientada al verbo HTTP
  let payloadUuid;

  if (req.method === 'GET') {
    payloadUuid = req.query?.device_uuid;
  } else {
    if (Array.isArray(req.body)) {
      payloadUuid = req.body[0]?.device_uuid;
    } else {
      payloadUuid = req.body?.device_uuid;
    }
  }

  if (!payloadUuid) {
    const origin = req.method === 'GET' ? 'los parámetros de la URL (query)' : 'el cuerpo de la petición (body)';
    return res.status(400).json({ error: `El campo device_uuid es requerido en ${origin}` });
  }

  try {
    // 1. Buscar el dispositivo por su token
    const result = await db.query(
      'SELECT id, id_user, device_uuid, status FROM devices WHERE device_token = $1',
      [deviceToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credencial de dispositivo inválida o no registrada' });
    }

    const device = result.rows[0];

    // 2. Validar contra los estados permitidos para esta ruta específica
    if (!allowedStatuses.includes(device.status)) {
      if (device.status === 'unlinked') {
        return res.status(403).json({ error: 'El dispositivo ha sido desvinculado o revocado' });
      }
      if (device.status === 'pending') {
        return res.status(403).json({ error: 'El dispositivo se encuentra en proceso de desvinculación pendiente' });
      }
      return res.status(403).json({ error: 'Estado de dispositivo no autorizado para esta operación' });
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
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = deviceAuthMiddleware;