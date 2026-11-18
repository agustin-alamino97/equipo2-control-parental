const crypto = require('crypto');

const validateHmac = async (req) => {
  const secret = process.env.HMAC_SECRET;

  // 1. Ingeniería defensiva: Validar que el servidor tenga configurado el secreto HMAC obligatoriamente
  if (!secret) {
    console.error('ERROR CRÍTICO: La variable de entorno HMAC_SECRET no está configurada en el servidor.');
    return {
      isValid: false,
      message: 'Error interno de configuración de seguridad.'
    };
  }

  const timestamp = req.headers['x-timestamp'];
  const signature = req.headers['x-signature'];

  if (!timestamp || !signature || typeof timestamp !== 'string' || typeof signature !== 'string') {
    return { isValid: false, message: 'Faltan headers de seguridad HMAC (x-timestamp o x-signature).' };
  }

  // 2. Protección contra ataques de repetición (Replay attacks): Ventana de 5 minutos (300 segundos)
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);

  if (isNaN(requestTime) || Math.abs(now - requestTime) > 300) {
    return { isValid: false, message: 'Timestamp expirado o inválido.' };
  }

  // 3. Construir el mensaje firmado unificando datos clave de la request
  const bodyString = req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '';
  const message = `${timestamp}:${req.method}:${req.originalUrl}:${bodyString}`;

  // 4. Calcular la firma esperada
  let expectedSignature;
  try {
    expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');
  } catch (err) {
    return { isValid: false, message: 'Error al procesar la firma HMAC.' };
  }

  // 5. Comparación segura contra ataques de temporización (timing attacks)
  try {
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { isValid: false, message: 'Firma HMAC inválida.' };
    }
  } catch (e) {
    return { isValid: false, message: 'Formato de firma HMAC malformado.' };
  }

  return { isValid: true };
};

module.exports = { validateHmac };