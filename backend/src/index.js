const express = require('express');
const config = require('./config/config');
const { initScheduledJobs } = require('./utils/cleanup');

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const pairingRoutes = require('./routes/pairing.routes');
const eventRoutes = require('./routes/event.routes');
//const syncRoutes = require('./routes/sync.routes');

const app = express();

// Middlewares globales
app.use(express.json());

// Montar módulos de rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/pairing', pairingRoutes);
app.use('/events', eventRoutes);
//app.use('/sync', syncRoutes);

// Arrancar servidor y tareas en segundo plano
const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  
  // Iniciar la tarea programada de limpieza
  initScheduledJobs();
});