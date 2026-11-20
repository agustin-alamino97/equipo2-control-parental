const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { initScheduledJobs } = require('./utils/cleanup');

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const pairingRoutes = require('./routes/pairing.routes');
const eventRoutes = require('./routes/event.routes');
const syncRoutes = require('./routes/sync.routes');

const app = express();

// Middlewares globales
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json());

// Montar módulos de rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/pairing', pairingRoutes);
app.use('/events', eventRoutes);
app.use('/sync', syncRoutes);

// Arrancar servidor y tareas en segundo plano
app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
  
  // Iniciar la tarea programada de limpieza
  initScheduledJobs();
});