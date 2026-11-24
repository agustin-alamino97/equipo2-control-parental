require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initScheduledJobs } = require('./utils/cleanup');
const apiKeyMiddleware = require('./middlewares/apiKeyMiddleware');

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const pairingRoutes = require('./routes/pairing.routes');
const eventRoutes = require('./routes/event.routes');
const syncRoutes = require('./routes/sync.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

// 1. Configurar orígenes permitidos desde el entorno
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite peticiones sin header Origin (ej: apps móviles nativas, Bruno, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origen no permitido por política CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'] // Ajusta el nombre del header de tu API key si es distinto
  })
);

// Rutas de prueba (un pequeño paréntesis totalmente random, pero necesario ponerlo antes de implementar api-key)
app.use('/test', testRoutes);

// 2. Parseo de JSON y middleware
app.use(express.json());
app.use(apiKeyMiddleware); // Middleware para validar la API Key en todas las rutas

// Montar módulos de rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/pairing', pairingRoutes);
app.use('/events', eventRoutes);
app.use('/sync', syncRoutes);

// Arrancar servidor y tareas en segundo plano
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  
  // Iniciar la tarea programada de limpieza
  initScheduledJobs();
});