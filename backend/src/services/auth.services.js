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
 * @param {Object} userData - Datos de registro del tutor.
 * @param {string} [userData.name] - name del tutor.
 * @param {string} [userData.surname] - surname del tutor.
 * @param {string} userData.email - Correo electrónico institucional o personal.
 * @param {string} userData.password - Contraseña en texto plano a encriptar.
 * @param {string} [userData.gender] - Género del usuario.
 * @param {string} [userData.birth_date] - Fecha de nacimiento (YYYY-MM-DD).
 * @returns {Promise<Object>} Datos del usuario registrado excluyendo el hash del password.
 */
const register = async ({ name, surname, email, password, gender, birth_date }) => {
  // 1. Verificar si el email ya existe en la base de datos
  const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('EL_EMAIL_YA_EXISTE');
  }

  // 2. Generar el hash de la contraseña usando Bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insertar el nuevo usuario mapeando los campos del DER
  const result = await db.query(
    `INSERT INTO users (name, surname, email, password_hash, gender, birth_date) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, name, surname, email, creation_time`,
    [name || null, surname || null, email, hashedPassword, gender || null, birth_date || null]
  );

  return result.rows[0];
};

/**
 * Autentica un tutor, genera sus tokens de acceso/refresco y registra la sesión activa.
 * @param {Object} credentials - Credenciales de acceso.
 * @param {string} credentials.email - Correo electrónico registrado.
 * @param {string} credentials.password - Contraseña enviada por el cliente.
 * @param {Object} [reqInfo={}] - Información contextual de la petición (IP, dispositivo, pushToken).
 * @returns {Promise<Object>} Tokens de autenticación y datos básicos del usuario.
 */
const login = async (credentials, reqInfo = {}) => {
  const { email, password } = credentials;

  // 1. Validar la existencia del usuario en la BD
  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userResult.rows[0];

  // Nota: Usamos bcrypt SOLO para la contraseña del usuario (como debe ser)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  // 2. Firmar token JWT de acceso (vigencia corta: 24 horas)
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 3. Generar refresh token seguro en texto plano 
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // 4. Hashear el refresh token usando SHA-256 (rápido y seguro para la BD)
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  // 5. UPSERT: Inserta la sesión o actualiza la existente para este usuario y dispositivo (id_user + device_info)
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

  // 6. Retornar el token de acceso, el refresh token plano (que el cliente guardará de forma segura) y los datos del usuario
  return {
    JWT: token,
    refresh_token: refreshToken, 
    user: {
      id: user.id,
      email: user.email
    }
  };
};

const refreshTokenService = async (incomingRefreshToken, deviceInfo = null) => {
  if (!incomingRefreshToken) {
    throw new Error('TOKEN_REQUERIDO');
  }

  // 1. Hashear el token recibido para compararlo con el de la BD
  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');

  // 2. Buscar la sesión activa en la base de datos
  // (Si quieres blindarlo al dispositivo, puedes validar también el device_info)
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

  // 3. Opcional pero recomendado: Validar que el dispositivo coincida si se envía
  if (deviceInfo && session.device_info && session.device_info !== deviceInfo) {
    throw new Error('DISPOSITIVO_NO_COINCIDE');
  }

  // 4. Generar un NUEVO Access Token de corta duración (24 horas)
  const newAccessToken = jwt.sign(
    { id: session.id_user },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 5. Actualizar la fecha de última actividad de la sesión
  await db.query(
    `UPDATE user_sessions 
     SET last_active_at = CURRENT_TIMESTAMP 
     WHERE id = $1`,
    [session.id]
  );

  // 6. Retornar el nuevo access token
  return {
    JWT: newAccessToken
  };
};

const logoutService = async (userId, deviceInfo = null) => {
  if (!userId) {
    throw new Error('USUARIO_REQUERIDO');
  }

  // Desactivamos la sesión activa para este usuario y dispositivo específico
  // Si deviceInfo viene nulo, podemos actualizar la sesión más reciente o usar el match exacto.
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