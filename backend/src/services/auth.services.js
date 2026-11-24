const db = require('../config/db');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// ============================================================================
// SERVICIOS DE AUTENTICACIÓN Y GESTIÓN DE SESIONES
// ============================================================================

/**
 * Registra un nuevo usuario (tutor) en el sistema.
 */
const register = async ({ name, surname, email, password, gender, birth_date }) => {
  const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('EL_EMAIL_YA_EXISTE');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, surname, email, password_hash, gender, birth_date) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, name, surname, email, creation_time`,
    [name || null, surname || null, email, hashedPassword, gender || null, birth_date || null]
  );

  return result.rows[0];
};

/**
 * Autentica un tutor, genera sus tokens y registra la sesión activa.
 */
const login = async (credentials, reqInfo = {}) => {
  const { email, password } = credentials;

  // 1. Buscar el usuario por EMAIL, trayendo TODO (incluido password_hash)
  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userResult.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  // 2. Firmar access token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 3. Generar refresh token en texto plano
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 4. UPSERT en user_sessions
  await db.query(
    `INSERT INTO user_sessions (id_user, refresh_token_hash, push_token, device_info, ip_address, expires_at, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     ON CONFLICT (id_user, device_info) 
     DO UPDATE SET 
       refresh_token_hash = EXCLUDED.refresh_token_hash,
       push_token = EXCLUDED.push_token,
       ip_address = EXCLUDED.ip_address,
       expires_at = EXCLUDED.expires_at,
       is_active = true,
       last_active_at = CURRENT_TIMESTAMP`,
    [
      user.id,
      refreshTokenHash,
      reqInfo.pushToken || null,
      reqInfo.deviceInfo || null,
      reqInfo.ipAddress || null,
      expiresAt
    ]
  );

  // 5. Retornar tokens + datos del usuario
  return {
    JWT: token,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      surname: user.surname ?? null,
    }
  };
};

/**
 * Renueva el access token usando un refresh token válido.
 */
const refreshTokenService = async (incomingRefreshToken, deviceInfo = null) => {
  if (!incomingRefreshToken) {
    throw new Error('TOKEN_REQUERIDO');
  }

  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');

  const sessionResult = await db.query(
    `SELECT * FROM user_sessions 
     WHERE refresh_token_hash = $1 
       AND is_active = true 
       AND expires_at > NOW()`,
    [tokenHash]
  );

  const session = sessionResult.rows[0];

  if (!session) {
    throw new Error('SESION_INVALIDA_O_EXPIRADA');
  }

  if (deviceInfo && session.device_info && session.device_info !== deviceInfo) {
    throw new Error('DISPOSITIVO_NO_COINCIDE');
  }

  // Buscar el email del usuario para incluirlo en el JWT (consistente con login)
  const userResult = await db.query('SELECT email FROM users WHERE id = $1', [session.id_user]);
  const userEmail = userResult.rows[0]?.email;

  const newAccessToken = jwt.sign(
    { id: session.id_user, email: userEmail },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  await db.query(
    `UPDATE user_sessions 
     SET last_active_at = CURRENT_TIMESTAMP 
     WHERE id = $1`,
    [session.id]
  );

  return {
    JWT: newAccessToken
  };
};

/**
 * Cierra la sesión del usuario para un dispositivo específico.
 */
const logoutService = async (userId, deviceInfo = null) => {
  if (!userId) {
    throw new Error('USUARIO_REQUERIDO');
  }

  const result = await db.query(
    `UPDATE user_sessions 
     SET is_active = false, 
         refresh_token_hash = NULL, 
         push_token = NULL, 
         ip_address = NULL,
         expires_at = CURRENT_TIMESTAMP,
         last_active_at = CURRENT_TIMESTAMP
     WHERE id_user = $1 AND device_info = $2 AND is_active = true`,
    [userId, deviceInfo]
  );

  return { success: true, rowsAffected: result.rowCount };
};

module.exports = {
  register,
  login,
  refreshTokenService,
  logoutService
};