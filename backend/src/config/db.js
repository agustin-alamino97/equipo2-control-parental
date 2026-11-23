const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR CRÍTICO: La variable de entorno DATABASE_URL no está configurada.');
  throw new Error('Falta DATABASE_URL en las variables de entorno.');
}

// Configuración de la conexión a PostgreSQL en Supabase
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;