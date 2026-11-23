const crypto = require('crypto');

const validateStaticApiKey = (req) => {
  const clientApiKey = req.headers['x-api-key'];
  const validApiKey = process.env.STATIC_KEY;

  // 1. Ingeniería defensiva: Validar que el servidor tenga configurada la API Key obligatoriamente
  if (!validApiKey) {
    console.error('ERROR CRÍTICO: La variable de entorno STATIC_KEY no está configurada en el servidor.');
    return {
      isValid: false,
      message: 'Error interno de configuración de seguridad.'
    };
  }
  
  if (!clientApiKey || typeof clientApiKey !== 'string') {
    return {
      isValid: false,
      message: 'Acceso denegado. Falta la API Key en los headers (x-api-key).'
    };
  }

  try {
    // 3. Convertir ambas keys a Buffers para realizar una comparación segura
    const clientBuffer = Buffer.from(clientApiKey.trim());
    const validBuffer = Buffer.from(validApiKey);

    // 4. Comparación de tiempo constante (Timing-safe) para prevenir ataques por canales laterales
    if (clientBuffer.length !== validBuffer.length || !crypto.timingSafeEqual(clientBuffer, validBuffer)) {
      return {
        isValid: false,
        message: 'API Key inválida.'
      };
    }
  } catch (err) {
    return {
      isValid: false,
      message: 'Formato de API Key inválido.'
    };
  }

  return { isValid: true };
};

module.exports = { validateStaticApiKey };