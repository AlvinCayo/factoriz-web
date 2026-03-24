// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importar todas tus rutas
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes'); 
const feedbackRoutes = require('./routes/feedbackRoutes');

// 2. INICIALIZAR EXPRESS (Aquí es donde se define "app")
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar las rutas a la "app"
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedbacks', feedbackRoutes); 

// 5. Ruta base de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '¡El backend de Factoriz está vivo y funcionando! 🚀' });
});

// 6. Encender el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});