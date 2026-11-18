const validateStaticApiKey = (req) => {
  const clientApiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'secreto-super-seguro-123';

  if (!clientApiKey) {
    return {
      isValid: false,
      message: 'Acceso denegado. Falta la API Key en los headers (x-api-key).'
    };
  }

  if (clientApiKey !== validApiKey) {
    return {
      isValid: false,
      message: 'API Key inválida.'
    };
  }

  return { isValid: true };
};

module.exports = { validateStaticApiKey };