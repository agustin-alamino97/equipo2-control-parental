const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN DE TUTORES (JWT)
// ============================================================================

/**
 * Intercepta las peticiones dirigidas a rutas protegidas para tutores.
 * Valida la presencia y firma del token JWT enviado en el encabezado Authorization.
 */
const authenticateToken = (req, res, next) => {
  // Extraemos el encabezado de autorización HTTP
  const authHeader = req.headers['authorization'];
  
  // Se espera el formato "Bearer <TOKEN>", por lo que extraemos la segunda parte
  const token = authHeader && authHeader.split(' ')[1];

  // Si no se adjuntó token, bloqueamos el acceso inmediatamente
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  // Verificamos la validez y firma del JWT con la clave secreta del servidor
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    
    // Inyectamos la identidad del tutor (payload del token: id, email) en el objeto request
    req.user = user;
    
    // Continuamos la ejecución hacia el controlador correspondiente
    next();
  });
};

module.exports = authenticateToken;