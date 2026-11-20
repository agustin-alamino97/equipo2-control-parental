const express = require('express');
const router = express.Router();
const pairingController = require('../controllers/pairing.controller');
const authenticateToken = require('../middlewares/authMiddleware');

// ============================================================================
// RUTAS DE EMPAREJAMIENTO (PAIRING PIN)
// ============================================================================

// Generar código PIN de 6 dígitos (Requiere tutor autenticado)
router.post('/generate', authenticateToken, pairingController.generateCode);

// Consumir el código PIN desde el dispositivo del menor (Público, validado con el PIN)
router.post('/consume', pairingController.consumeCode);

module.exports = router;