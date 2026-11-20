const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');

// ============================================================================
// RUTAS DE GESTIÓN DE DISPOSITIVOS
// ============================================================================

// 1. Obtener el listado de dispositivos (Exclusivo Tutor)
router.get('/', authMiddleware, deviceController.getDevices);

// 2. El tutor solicita desvincular un dispositivo (Exclusivo Tutor)
router.post('/:deviceId/unlink', authMiddleware, deviceController.requestUnlink);

// 3. La app del protegido confirma la desvinculación (Exclusivo Dispositivo - Permite estado 'pending')
router.post('/confirm-unlink', deviceAuthMiddleware(['pending']), deviceController.confirmDeviceUnlink);

module.exports = router;