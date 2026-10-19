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
    if (error.message === 'CREDANCIALES_INVALIDAS') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login
};