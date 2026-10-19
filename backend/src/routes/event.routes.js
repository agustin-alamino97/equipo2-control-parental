const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticateToken = require('../middlewares/authMiddleware');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');

// ============================================================================
// RUTAS DE EVENTOS DE PROTECCIÓN Y ALERTAS
// ============================================================================

// Recepción de eventos desde la app del menor (Público, validado por device_uuid)
router.post('/', deviceAuthMiddleware, eventController.recibirEvento);

// Consulta de historial de eventos por el tutor (Protegido por JWT)
router.get('/', authenticateToken, eventController.getEvents);

// Consulta de alertas generadas para la app del tutor (Protegido por JWT)
router.get('/alerts', authenticateToken, eventController.getAlerts);

// Marcar una alerta específica como leída (Protegido por JWT)
router.patch('/alerts/:id/read', authenticateToken, eventController.markAsRead);

module.exports = router;