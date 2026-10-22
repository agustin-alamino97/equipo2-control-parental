const authService = require('../services/auth.services');

// ============================================================================
// CONTROLADOR DE AUTENTICACIÓN (TUTORES)
// ============================================================================

/**
 * Procesa el registro de un nuevo usuario tutor.
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    // Control de error cuando el correo ya existe en la BD
    if (error.message === 'EL_EMAIL_YA_EXISTE') {
      return res.status(400).json({ error: 'El email ya se encuentra registrado' });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Autentica al tutor y retorna JWT junto a datos de la sesión.
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    // Extraemos metadatos de la petición para auditoría y registro de sesión
    const reqInfo = {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      deviceInfo: req.headers['user-agent'] || 'Desconocido',
      pushToken: req.body.push_token || null
    };

    const data = await authService.login(req.body, reqInfo);
    return res.status(200).json(data);
  } catch (error) {
    if (error.message === 'CREDENCIALES_INVALIDAS') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const deviceInfo = req.headers['user-agent'] || null;

    const data = await authService.refreshTokenService(refresh_token, deviceInfo);

    return res.status(200).json({
      message: 'Token refrescado con éxito',
      ...data
    });
  } catch (error) {
    if (error.message === 'TOKEN_REQUERIDO') {
      return res.status(400).json({ error: 'El refresh token es obligatorio' });
    }
    if (
      error.message === 'SESION_INVALIDA_O_EXPIRADA' || 
      error.message === 'DISPOSITIVO_NO_COINCIDE'
    ) {
      // 401 Unauthorized indica a la app móvil que debe limpiar credenciales y mandar al Login
      return res.status(401).json({ error: 'La sesión ha expirado o es inválida. Por favor, inicie sesión nuevamente.' });
    }

    console.error('Error en refresh token:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const logout = async (req, res) => {
  try {
    // req.user viene del middleware de verificación del Access Token
    const userId = req.user?.id; 
    const deviceInfo = req.headers['user-agent'] || null;

    await authService.logoutService(userId, deviceInfo);

    return res.status(200).json({
      message: 'Sesión cerrada exitosamente en este dispositivo.'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ error: 'Error interno al cerrar sesión' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};