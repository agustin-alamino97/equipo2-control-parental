const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');
const notificationService = require('../services/notifications/notification.services');

// 1. Ruta de prueba abierta (sin protección)
router.get('/ping', (req, res) => {
  return res.status(200).json({
    success: true,
    message: '¡Ruta de prueba abierta funcionando sin problemas!'
  });
});

// 2. Ruta de prueba protegida con tu apiKeyMiddleware
router.get('/secure', apiKeyMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: '¡Autenticación exitosa con API Key! Acceso concedido a la zona protegida.'
  });
});

// 3. Ruta de prueba para enviar notificaciones push
router.post('/push',apiKeyMiddleware, async (req, res) => {
  try {
    const { pushToken, title, body, data } = req.body;

    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: 'Falta pushToken en el body.',
      });
    }

    const result = await notificationService.enviarNotificacion(pushToken, {
      title: title || 'Prueba local BA Protege+',
      body: body || 'Notificación enviada desde /test/push',
      data: data || { source: 'test-endpoint' },
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;