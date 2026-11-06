const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');

// =========================================================================
// 1. RUTAS DEL SISTEMA GLOBAL (Existentes)
// =========================================================================
router.get('/system', syncController.getSystemSync);


// =========================================================================
// 2. RUTAS DE CUSTOM BLOCKLIST (TUTOR) - Autenticación con JWT de Usuario
// =========================================================================

/**
 * @route   GET localhost:3000/sync/custom/user
 * @desc    Obtiene las reglas personalizadas activas para el panel del tutor
 */
router.get('/custom/user', authMiddleware, syncController.getCustomRulesForUser);

/**
 * @route   POST localhost:3000/sync/custom/user
 * @desc    Agrega o reactiva una regla personalizada y dispara el Silent Push
 */
router.post('/custom/user', authMiddleware, syncController.addCustomRuleForUser);


// =========================================================================
// 3. RUTAS DE CUSTOM BLOCKLIST (DISPOSITIVO PROTEGIDO) - Doble validación
// =========================================================================

/**
 * @route   GET localhost:3000/sync/custom/device
 * @desc    Sincronización de reglas personalizadas para el dispositivo (Checksum + Timestamp + 7 días)
 */
router.get('/custom/device', deviceAuthMiddleware(['linked']), syncController.getCustomRulesForDevice);


module.exports = router;