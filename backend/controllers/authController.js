const pool = require('../db');

async function registerClient(req, res) {
  const { email, password, firstName, lastName, birthDate, gender, phone } = req.body;
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN');
    
    const userQuery = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id';
    const userResult = await dbClient.query(userQuery, [email, password, 'usuario']);
    const userId = userResult.rows[0].id;

    const profileQuery = 'INSERT INTO client_profiles (user_id, first_name, last_name, birth_date, gender, phone) VALUES ($1, $2, $3, $4, $5, $6)';
    await dbClient.query(profileQuery, [userId, firstName, lastName, birthDate, gender, phone]);
    
    await dbClient.query('COMMIT');
    res.status(201).json({ success: true, userId });
  } catch (error) {
    await dbClient.query('ROLLBACK');
    console.error("Error en registerClient:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    dbClient.release();
  }
}

async function registerBusiness(req, res) {
  const { email, password, repName, repLastName, birthDate, gender, phone, licenseUrl, zone, street, buildingNumber, businessCategory } = req.body;
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN');
    
    const userQuery = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id';
    const userResult = await dbClient.query(userQuery, [email, password, 'centro']);
    const userId = userResult.rows[0].id;

    const profileQuery = 'INSERT INTO business_profiles (user_id, representative_name, representative_last_name, birth_date, gender, phone, license_pdf_url, zone, street, building_number, business_category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
    await dbClient.query(profileQuery, [userId, repName, repLastName, birthDate, gender, phone, licenseUrl, zone, street, buildingNumber, businessCategory]);

    await dbClient.query('COMMIT');
    res.status(201).json({ success: true, userId });
  } catch (error) {
    await dbClient.query('ROLLBACK');
    console.error("Error en registerBusiness:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    dbClient.release();
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const queryText = 'SELECT id, role FROM users WHERE email = $1 AND password = $2';
  
  try {
    const result = await pool.query(queryText, [email, password]);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function resetPassword(req, res) {
  const { email, phone, newPassword } = req.body;
  const verifyQuery = 'SELECT u.id FROM users u JOIN client_profiles p ON u.id = p.user_id WHERE u.email = $1 AND p.phone = $2';
  
  try {
    const verifyResult = await pool.query(verifyQuery, [email, phone]);
    if (verifyResult.rowCount > 0) {
      const userId = verifyResult.rows[0].id;
      const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2';
      await pool.query(updateQuery, [newPassword, userId]);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { registerClient, registerBusiness, loginUser, resetPassword };