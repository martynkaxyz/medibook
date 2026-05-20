const SlotModel = require('../models/slot.model');
const { validationResult } = require('express-validator');

// Pobierz dostepne sloty (dla pacjenta - wybor terminu)
const getAvailable = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Podaj doctorId i date' });
    }
    const slots = await SlotModel.getAvailable(doctorId, date);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Pobierz wszystkie sloty lekarza (dla doktora)
const getMySlots = async (req, res) => {
  try {
    // Znajdz doctor_id na podstawie user_id
    const pool = require('../config/db');
    const doctor = await pool.query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [req.user.id]
    );
    if (!doctor.rows.length) {
      return res.status(404).json({ error: 'Nie znaleziono profilu lekarza' });
    }
    const slots = await SlotModel.getByDoctor(doctor.rows[0].id);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Dodaj nowy slot (tylko doktor)
const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pool = require('../config/db');
    const doctor = await pool.query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [req.user.id]
    );
    if (!doctor.rows.length) {
      return res.status(404).json({ error: 'Nie znaleziono profilu lekarza' });
    }
    const { slotDate, startTime, endTime } = req.body;
    const slot = await SlotModel.create(doctor.rows[0].id, slotDate, startTime, endTime);
    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Toggle dostepnosci slotu
const toggleAvailability = async (req, res) => {
  try {
    const pool = require('../config/db');
    const doctor = await pool.query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [req.user.id]
    );
    if (!doctor.rows.length) {
      return res.status(404).json({ error: 'Nie znaleziono profilu lekarza' });
    }
    const slot = await SlotModel.toggleAvailability(req.params.id, doctor.rows[0].id);
    if (!slot) return res.status(404).json({ error: 'Slot nie znaleziony' });
    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Usun slot
const remove = async (req, res) => {
  try {
    const pool = require('../config/db');
    const doctor = await pool.query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [req.user.id]
    );
    if (!doctor.rows.length) {
      return res.status(404).json({ error: 'Nie znaleziono profilu lekarza' });
    }
    const slot = await SlotModel.remove(req.params.id, doctor.rows[0].id);
    if (!slot) return res.status(404).json({ error: 'Slot nie znaleziony' });
    res.json({ message: 'Slot usuniety' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

module.exports = { getAvailable, getMySlots, create, toggleAvailability, remove };