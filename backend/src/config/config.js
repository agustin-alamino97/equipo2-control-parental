const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('ERROR CRÍTICO: La variable de entorno JWT_SECRET no está configurada.');
  throw new Error('Falta JWT_SECRET en las variables de entorno.');
}

module.exports = {
  JWT_SECRET: jwtSecret
};