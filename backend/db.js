// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Si Neon DB te exige SSL, asegúrate de tener esto activado:
  ssl: {
    rejectUnauthorized: false
  }
});

// --- ESTA ES LA LÍNEA MÁGICA QUE EVITA EL CRASH ---
pool.on('error', (err, client) => {
  console.error('⚠️ Error inesperado en un cliente inactivo de la base de datos:', err.message);
  // Node.js registrará el error en la consola, pero ya NO apagará el servidor.
});

module.exports = pool;