const crypto = require('crypto');

const secret = 'secreto-hmac-compartido'; // O process.env.HMAC_SECRET en el futuro

const validateHmac = async (req) => {
  const timestamp = req.headers['x-timestamp'];
  const signature = req.headers['x-signature'];

  if (!timestamp || !signature) {
    return { isValid: false, message: 'Faltan headers de seguridad HMAC (x-timestamp o x-signature).' };
  }

  // 1. Protección contra ataques de repetición (Replay attacks): Ventana de 5 minutos (300 segundos)
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);

  if (isNaN(requestTime) || Math.abs(now - requestTime) > 300) {
    return { isValid: false, message: 'Timestamp expirado o inválido.' };
  }

  // 2. Construir el mensaje firmado unificando datos clave de la request
  const bodyString = req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '';
  const message = `${timestamp}:${req.method}:${req.originalUrl}:${bodyString}`;

  // 3. Calcular la firma esperada
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  // Logs temporales de depuración
  console.log('--- DEBUG HMAC BACKEND ---');
  console.log('Method:', req.method);
  console.log('OriginalUrl:', req.originalUrl);
  console.log('Message construido:', message);
  console.log('Firma recibida en header:', signature);
  console.log('Firma esperada:', expectedSignature);

  // 4. Comparación segura contra ataques de temporización (timing attacks)
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