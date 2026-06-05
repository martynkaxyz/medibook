const pool = require('../config/db');

// Pobierz wszystkich uzytkownikow
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, role, is_blocked, 
     login_attempts, created_at FROM users ORDER BY created_at DESC`
  );
  return result.rows;
};

// Zmien role lub zablokuj usera
const updateUser = async (id, role, isBlocked) => {
  const result = await pool.query(
    `UPDATE users SET role = $1, is_blocked = $2 
     WHERE id = $3 RETURNING id, email, first_name, last_name, role, is_blocked`,
    [role, isBlocked, id]
  );
  return result.rows[0];
};

// Statystyki
const getStats = async () => {
  const users = await pool.query('SELECT COUNT(*) FROM users');
  const appointments = await pool.query('SELECT COUNT(*) FROM appointments');
  const pending = await pool.query(
    "SELECT COUNT(*) FROM appointments WHERE status = 'pending'"
  );
  const confirmed = await pool.query(
    "SELECT COUNT(*) FROM appointments WHERE status = 'confirmed'"
  );

  return {
    total_users: parseInt(users.rows[0].count),
    total_appointments: parseInt(appointments.rows[0].count),
    pending_appointments: parseInt(pending.rows[0].count),
    confirmed_appointments: parseInt(confirmed.rows[0].count),
  };
};

module.exports = { getAllUsers, updateUser, getStats };