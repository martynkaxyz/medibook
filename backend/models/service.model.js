const pool = require('../config/db');

// Pobierz wszystkie aktywne uslugi
const getAll = async () => {
  const result = await pool.query(
    'SELECT * FROM services ORDER BY name'
  );
  return result.rows;
};

// Pobierz tylko aktywne
const getActive = async () => {
  const result = await pool.query(
    'SELECT * FROM services WHERE is_active = true ORDER BY name'
  );
  return result.rows;
};

// Dodaj usluge
const create = async (name, durationMinutes) => {
  const result = await pool.query(
    'INSERT INTO services (name, duration_minutes) VALUES ($1, $2) RETURNING *',
    [name, durationMinutes]
  );
  return result.rows[0];
};

// Edytuj usluge
const update = async (id, name, durationMinutes, isActive) => {
  const result = await pool.query(
    `UPDATE services 
     SET name = $1, duration_minutes = $2, is_active = $3
     WHERE id = $4 RETURNING *`,
    [name, durationMinutes, isActive, id]
  );
  return result.rows[0];
};

// Usun usluge
const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM services WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = { getAll, getActive, create, update, remove };