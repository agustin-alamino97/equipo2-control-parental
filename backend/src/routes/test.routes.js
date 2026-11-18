const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

// 1. Ruta de prueba abierta (sin protección)
router.get('/open', (req, res) => {
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

module.exports = router;