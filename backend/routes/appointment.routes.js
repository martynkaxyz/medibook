const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, requireRole } = require('../middleware/auth');
const {
  getMyAppointments,
  createAppointment,
  cancelAppointment,
} = require('../controllers/appointment.controller');

// GET /api/appointments - wizyty zalogowanego pacjenta
router.get('/', authMiddleware, getMyAppointments);

// POST /api/appointments - nowa rezerwacja
router.post('/', authMiddleware, requireRole('patient'), [
  body('slotId').isInt().withMessage('Podaj poprawny slot'),
  body('serviceId').isInt().withMessage('Podaj poprawna usluge'),
], createAppointment);

// PATCH /api/appointments/:id/cancel - anuluj wizyte
router.patch('/:id/cancel', authMiddleware, requireRole('patient'), cancelAppointment);

module.exports = router;