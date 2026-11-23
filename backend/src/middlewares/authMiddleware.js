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
      /*
       * IMPLEMENTACIÓN ORIGINAL - JIAN
       *
       * El middleware devolvía HTTP 403 cuando el JWT
       * era inválido o había expirado.
       *
       * return res.status(403).json({
       *   error: 'Token inválido o expirado'
       * });
       */

      /*
       * MODIFICACIÓN - LUCÍA
       * Fecha: 22/11/2026
       *
       * Se cambia el código HTTP 403 por HTTP 401.
       *
       * Motivo:
       * 401 indica que el token de autenticación es inválido
       * o expiró.
       *
       * 403 se utiliza cuando el usuario está autenticado,
       * pero no tiene autorización para acceder al recurso.
       *
       * El frontend detecta el 401 e intenta renovar
       * automáticamente el JWT mediante el refresh token.
       */
      return res.status(401).json({
        error: 'Token inválido o expirado'
      });
    }




    // Inyectamos la identidad del tutor (payload del token: id, email) en el objeto request
    req.user = user;

    // Continuamos la ejecución hacia el controlador correspondiente
    next();
  });
};

module.exports = authenticateToken;