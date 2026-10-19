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

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('CREDENCIALES_INVALIDAS');
  }

  // 2. Firmar token JWT con vigencia de 24 horas
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 3. Generar refresh token seguro, hashearlo y registrar la sesión (Vigencia 7 días)
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO user_sessions (id_user, refresh_token_hash, push_token, device_info, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      user.id,
      refreshTokenHash,
      reqInfo.pushToken || null,
      reqInfo.deviceInfo || null,
      reqInfo.ipAddress || null,
      expiresAt
    ]
  );

  return {
    message: 'Login exitoso',
    user: { id: user.id, email: user.email, name: user.name },
    token,
    refreshToken
  };
};

module.exports = {
  register,
  login
};