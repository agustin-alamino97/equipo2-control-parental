const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================================
// RUTAS DE AUTENTICACIÓN (PÚBLICAS)
// ============================================================================

// Registro de nuevos tutores
router.post('/register', authController.register);

// Inicio de sesión para tutores
router.post('/login', authController.login);

// Ruta protegida de prueba/verificación de sesión
// router.get('/me', authMiddleware, (req, res) => {
//   res.json({ message: 'Acceso concedido', user: req.user });
// });

module.exports = router;