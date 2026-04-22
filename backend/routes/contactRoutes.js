// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.post('/', async (req, res) => {
  const { nombres, apellidos, email, motivo, servicio } = req.body;

  // Validación básica
  if (!nombres || !apellidos || !email || !motivo) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
  }

  try {
    // Insertar en la base de datos
    const query = 'INSERT INTO contact_messages (nombres, apellidos, email, motivo, servicio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nombres, apellidos, email, motivo, servicio || 'No especificado'];
    
    await pool.query(query, values);

    res.status(201).json({ message: '¡Mensaje enviado con éxito! Nos contactaremos contigo pronto.' });
  } catch (err) {
    console.error('Error al guardar mensaje:', err);
    res.status(500).json({ error: 'Ocurrió un error al enviar el mensaje. Inténtalo más tarde.' });
  }
});

module.exports = router;