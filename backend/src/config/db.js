const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL en supabase
const pool = new Pool({
  connectionString: 'postgres://postgres.qisgdgmwgupirwbrmkze:protegemasdbver00@aws-0-sa-east-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
