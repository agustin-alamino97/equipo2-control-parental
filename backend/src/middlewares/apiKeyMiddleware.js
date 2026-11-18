const { validateStaticApiKey } = require('./api-key-validators/staticValidator');

const apiKeyMiddleware = (req, res, next) => {
  // Puedes leer la API key del header (ej: x-api-key)
  const validation = validateStaticApiKey(req);
  
  // Definimos una clave esperada (idealmente vendría de process.env.API_KEY)
  const validApiKey = process.env.API_KEY || 'secreto-super-seguro-123';

  if (!validation.isValid) {
    return res.status(401).json({
      success: false,
      message: validation.message
    });
  }


  // Si todo está bien, continúa con la ejecución
  next();
};

module.exports = apiKeyMiddleware;