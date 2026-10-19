const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');

// Endpoint para reglas globales del sistema
router.get('/system', syncController.getSystemSync);

// Endpoint para reglas personalizadas por dispositivo (con UUID en la ruta)
router.get('/custom/:deviceUuid', syncController.getCustomSync);

module.exports = router;