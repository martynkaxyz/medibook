const pool = require('../config/db');

// Pobierz wizyty pacjenta z filtrowaniem i paginacja
const getByPatient = async (patientId, { status, date, page = 1, limit = 10 }) => {
  let query = 'SELECT a.*, ts.slot_date, ts.start_time, ts.end_time, u.first_name as doctor_first_name, u.last_name as doctor_last_name FROM appointments a JOIN time_slots ts ON a.slot_id = ts.id JOIN doctors d ON ts.doctor_id = d.id JOIN users u ON d.user_id = u.id WHERE a.patient_id = $1';
  const params = [patientId];
  let idx = 2;

  if (status) {
    query += ` AND a.status = $${idx}`;
    params.push(status);
    idx++;
  }
  if (date) {
    query += ` AND ts.slot_date = $${idx}`;
    params.push(date);
    idx++;
  }

  query += ` ORDER BY ts.slot_date DESC, ts.start_time DESC`;
  query += ` LIMIT $${idx} OFFSET $${idx + 1}`;
  params.push(limit, (page - 1) * limit);

  const result = await pool.query(query, params);
  return result.rows;
};

// Stworz nowa rezerwacje
const create = async (patientId, slotId, serviceId, notes) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Sprawdz czy slot jest dostepny
    const slot = await client.query(
      'SELECT * FROM time_slots WHERE id = $1 AND is_available = true',
      [slotId]
    );
    if (!slot.rows.length) throw new Error('Slot niedostepny');

    // Stworz rezerwacje
    const appt = await client.query(
      'INSERT INTO appointments (patient_id, slot_id, notes) VALUES ($1, $2, $3) RETURNING *',
      [patientId, slotId, notes]
    );

    // Dodaj usluge
    if (serviceId) {
      await client.query(
        'INSERT INTO appointment_services (appointment_id, service_id) VALUES ($1, $2)',
        [appt.rows[0].id, serviceId]
      );
    }

    // Oznacz slot jako zajety
    await client.query(
      'UPDATE time_slots SET is_available = false WHERE id = $1',
      [slotId]
    );

    await client.query('COMMIT');
    return appt.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Anuluj wizyte
const cancel = async (appointmentId, patientId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const appt = await client.query(
      'UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 AND patient_id = $3 AND status NOT IN ($4, $5) RETURNING *',
      ['cancelled', appointmentId, patientId, 'cancelled', 'completed']
    );
    if (!appt.rows.length) throw new Error('Nie mozna anulowac tej wizyty');

    // Zwolnij slot
    await client.query(
      'UPDATE time_slots SET is_available = true WHERE id = $1',
      [appt.rows[0].slot_id]
    );

    await client.query('COMMIT');
    return appt.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Pobierz wizyty pacjentów dla zalogowanego lekarza
const getByDoctor = async (doctorUserId) => {
  const result = await pool.query(
    `SELECT a.*, ts.slot_date, ts.start_time, ts.end_time,
            u.first_name AS patient_first_name, u.last_name AS patient_last_name,
            u.email AS patient_email
     FROM appointments a
     JOIN time_slots ts ON a.slot_id = ts.id
     JOIN doctors d ON ts.doctor_id = d.id
     JOIN users u ON a.patient_id = u.id
     WHERE d.user_id = $1
     ORDER BY ts.slot_date DESC, ts.start_time DESC`,
    [doctorUserId]
  );
  return result.rows;
};

module.exports = { getByPatient, getByDoctor, create, cancel };