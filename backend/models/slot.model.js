const pool = require('../config/db');

// Pobierz dostepne sloty dla lekarza po dacie
const getAvailable = async (doctorId, date) => {
  const result = await pool.query(
    `SELECT ts.*, u.first_name, u.last_name 
     FROM time_slots ts
     JOIN doctors d ON ts.doctor_id = d.id
     JOIN users u ON d.user_id = u.id
     WHERE ts.doctor_id = $1 
     AND ts.slot_date = $2 
     AND ts.is_available = true
     ORDER BY ts.start_time`,
    [doctorId, date]
  );
  return result.rows;
};

// Pobierz wszystkie sloty lekarza
const getByDoctor = async (doctorId) => {
  const result = await pool.query(
    `SELECT * FROM time_slots 
     WHERE doctor_id = $1 
     ORDER BY slot_date, start_time`,
    [doctorId]
  );
  return result.rows;
};

// Dodaj nowy slot
const create = async (doctorId, slotDate, startTime, endTime) => {
  const result = await pool.query(
    `INSERT INTO time_slots (doctor_id, slot_date, start_time, end_time)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [doctorId, slotDate, startTime, endTime]
  );
  return result.rows[0];
};

// Toggle dostepnosci slotu
const toggleAvailability = async (slotId, doctorId) => {
  const result = await pool.query(
    `UPDATE time_slots 
     SET is_available = NOT is_available
     WHERE id = $1 AND doctor_id = $2
     RETURNING *`,
    [slotId, doctorId]
  );
  return result.rows[0];
};

// Usun slot
const remove = async (slotId, doctorId) => {
  const result = await pool.query(
    `DELETE FROM time_slots 
     WHERE id = $1 AND doctor_id = $2
     RETURNING *`,
    [slotId, doctorId]
  );
  return result.rows[0];
};

module.exports = { getAvailable, getByDoctor, create, toggleAvailability, remove };