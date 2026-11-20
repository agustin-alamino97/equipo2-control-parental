require('dotenv').config();

const required = name => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const port = Number.parseInt(process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}

module.exports = {
  port,
  databaseUrl: required('DATABASE_URL'),
  databaseSsl: process.env.DB_SSL === 'true',
  JWT_SECRET: required('JWT_SECRET'),
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
};
