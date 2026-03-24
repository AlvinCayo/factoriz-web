// backend/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. OBTENER todos los comentarios y puntuaciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_feedbacks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener feedbacks:', err);
    res.status(500).json({ error: 'Error al obtener los comentarios de la base de datos.' });
  }
});

// 2. CREAR un nuevo comentario con puntuación
router.post('/', async (req, res) => {
  const { username, comment, rating } = req.body;
  
  // Validar que los campos no estén vacíos
  if (!username || !comment || !rating) {
    return res.status(400).json({ error: 'El usuario, el comentario y la puntuación son obligatorios.' });
  }

  // Validar que la puntuación sea estrictamente entre 1 y 5
  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'La puntuación debe ser un número entre 1 y 5.' });
  }

  try {
    const query = 'INSERT INTO user_feedbacks (username, comment, rating) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [username, comment, numericRating]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al guardar feedback:', err);
    res.status(500).json({ error: 'Error al guardar el comentario en la base de datos.' });
  }
});

module.exports = router;