const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, requireRole } = require('../middleware/auth');
const {
  getAvailable,
  getMySlots,
  create,
  toggleAvailability,
  remove,
} = require('../controllers/slot.controller');

// GET /api/slots?doctorId=1&date=2026-06-01 - dostepne sloty (dla pacjenta)
router.get('/', getAvailable);

// GET /api/slots/my - sloty zalogowanego lekarza
router.get('/my', authMiddleware, requireRole('doctor'), getMySlots);

// POST /api/slots - dodaj nowy slot (tylko doktor)
router.post('/', authMiddleware, requireRole('doctor'), [
  body('slotDate').isDate().withMessage('Podaj poprawna date'),
  body('startTime').notEmpty().withMessage('Podaj godzine rozpoczecia'),
  body('endTime').notEmpty().withMessage('Podaj godzine zakonczenia'),
], create);

// PATCH /api/slots/:id/toggle - toggle dostepnosci
router.patch('/:id/toggle', authMiddleware, requireRole('doctor'), toggleAvailability);

// DELETE /api/slots/:id - usun slot
router.delete('/:id', authMiddleware, requireRole('doctor'), remove);

module.exports = router;