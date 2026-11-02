const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const authenticateToken = require('../middlewares/authMiddleware');

// ============================================================================
// RUTAS DE GESTIÓN DE DISPOSITIVOS (PROTEGIDAS)
// ============================================================================

// Aplicar middleware de autenticación a todas las rutas del módulo
router.use(authenticateToken);

// Obtener el listado de dispositivos pertenecientes al tutor autenticado
router.get('/', deviceController.getDevices);

// Desvincular un dispositivo específico por su ID
router.patch('/:id/unlink', authenticateToken, deviceController.unlinkDevice);

module.exports = router;