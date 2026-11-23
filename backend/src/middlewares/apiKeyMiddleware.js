const { validateStaticApiKey } = require('./api-key-validators/staticValidator');
const { validateHmac } = require('./api-key-validators/hmacValidator');
const { validatePlayIntegrity } = require('./api-key-validators/playIntegrityValidator');

// Mapa de estrategias disponibles para alternar fácilmente
const validators = {
  static: validateStaticApiKey,
  hmac: validateHmac,
  'play-integrity': validatePlayIntegrity
};

const apiKeyMiddleware = async (req, res, next) => {
  // Leemos la estrategia activa desde las variables de entorno (por defecto 'static')
  const validatorType = (process.env.API_VALIDATOR_TYPE || 'static').toLowerCase();
  
  const selectedValidator = validators[validatorType];

  if (!selectedValidator) {
    return res.status(500).json({
      success: false,
      message: `La estrategia de validación '${validatorType}' no es válida o no está registrada.`
    });
  }

  try {
    // Soportamos validadores síncronos y asíncronos con await
    const validation = await selectedValidator(req);

    if (!validation.isValid) {
      return res.status(401).json({
        success: false,
        message: validation.message
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error interno en el middleware de seguridad: ${error.message}`
    });
  }
};

module.exports = apiKeyMiddleware;