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

// Ruta de Refresh
router.post('/refresh', authController.refresh);

// Ruta de Logout 
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;