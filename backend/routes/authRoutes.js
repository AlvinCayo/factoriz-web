// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Nuestra conexión a Neon

const router = express.Router();

// 1. RUTA PARA REGISTRAR USUARIOS
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificamos si el usuario ya existe
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Encriptamos la contraseña por seguridad
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Guardamos el usuario en la base de datos
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, passwordEncriptada]
    );

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al registrar' });
  }
});

// 2. RUTA PARA INICIAR SESIÓN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscamos al usuario en la base de datos
    const usuario = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    
    if (usuario.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Comparamos la contraseña ingresada con la encriptada
    const passwordValida = await bcrypt.compare(password, usuario.rows[0].password);
    if (!passwordValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generamos el Token de sesión (JWT)
    const token = jwt.sign(
      { id: usuario.rows[0].id, username: usuario.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El usuario tendrá que volver a loguearse en 24 horas
    );

    res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      token: token,
      username: usuario.rows[0].username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
  }
});

module.exports = router;