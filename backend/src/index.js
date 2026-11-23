require('dotenv').config();

const express = require('express');
const config = require('./config/config');
const { initScheduledJobs } = require('./utils/cleanup');
const apiKeyValidator = require('./middlewares/apiKeyMiddleware');

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const pairingRoutes = require('./routes/pairing.routes');
const eventRoutes = require('./routes/event.routes');
const syncRoutes = require('./routes/sync.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

// Middlewares globales
app.use(express.json());
//app.use(apiKeyValidator); // Middleware para validar la API Key en todas las rutas

// Montar módulos de rutas
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/pairing', pairingRoutes);
app.use('/events', eventRoutes);
app.use('/sync', syncRoutes);
app.use('/test', testRoutes);

// Arrancar servidor y tareas en segundo plano
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  
  // Iniciar la tarea programada de limpieza
  initScheduledJobs();
});