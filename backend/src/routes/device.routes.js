const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');

// ============================================================================
// RUTAS DE GESTIÓN DE DISPOSITIVOS (PROTEGIDAS)
// ============================================================================

// Aplicar middleware d

// Obtener el listado de dispositivos pertenecientes al tutor autenticado
router.get('/', authMiddleware, deviceController.getDevices);

// El tutor solicita desvincular un dispositivo a su cargo
router.post('/:deviceId/unlink', authMiddleware, deviceController.requestUnlink);

// La app del protegido confirma que completó la desvinculación local
router.post('/confirm-unlink', deviceAuthMiddleware, deviceController.confirmDeviceUnlink);

module.exports = router;