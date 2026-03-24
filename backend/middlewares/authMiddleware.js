// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  // Obtenemos el token de la cabecera de la petición
  const token = req.header('Authorization');

  // Si no hay token, denegamos el acceso
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token de autenticación.' });
  }

  try {
    // Verificamos que el token sea válido usando nuestro secreto
    // El formato suele ser "Bearer el_token_aqui", por eso separamos
    const tokenLimpio = token.split(' ')[1];
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    
    // Guardamos los datos del usuario en la petición para usarlos después
    req.user = verificado;
    next(); // Permite que la petición continúe hacia la ruta
  } catch (error) {
    res.status(400).json({ error: 'Token no válido o expirado.' });
  }
};

module.exports = verificarToken;