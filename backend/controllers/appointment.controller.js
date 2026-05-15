const AppointmentModel = require('../models/appointment.model');
const { validationResult } = require('express-validator');

// Pobierz wizyty zalogowanego pacjenta
const getMyAppointments = async (req, res) => {
  try {
    const { status, date, page, limit } = req.query;
    const appointments = await AppointmentModel.getByPatient(
      req.user.id,
      { status, date, page, limit }
    );
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Stworz nowa rezerwacje
const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { slotId, serviceId, notes } = req.body;
    const appointment = await AppointmentModel.create(
      req.user.id,
      slotId,
      serviceId,
      notes
    );
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    if (err.message === 'Slot niedostepny') {
      return res.status(409).json({ error: 'Ten termin jest juz zajety' });
    }
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Anuluj wizyte
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.cancel(
      req.params.id,
      req.user.id
    );
    res.json(appointment);
  } catch (err) {
    console.error(err);
    if (err.message === 'Nie mozna anulowac tej wizyty') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Blad serwera' });
  }
};

module.exports = { getMyAppointments, createAppointment, cancelAppointment };