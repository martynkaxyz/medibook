const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, requireRole } = require('../middleware/auth');
const {
  getActive,
  getAll,
  create,
  update,
  remove,
} = require('../controllers/service.controller');

// GET /api/services - aktywne uslugi (publiczne)
router.get('/', getActive);

// GET /api/services/all - wszystkie uslugi (admin)
router.get('/all', authMiddleware, requireRole('admin'), getAll);

// POST /api/services - dodaj usluge (admin)
router.post('/', authMiddleware, requireRole('admin'), [
  body('name').notEmpty().withMessage('Podaj nazwe uslugi'),
  body('duration_minutes').isInt({ min: 1 }).withMessage('Podaj czas trwania'),
], create);

// PATCH /api/services/:id - edytuj usluge (admin)
router.patch('/:id', authMiddleware, requireRole('admin'), [
  body('name').notEmpty().withMessage('Podaj nazwe uslugi'),
  body('duration_minutes').isInt({ min: 1 }).withMessage('Podaj czas trwania'),
  body('is_active').isBoolean().withMessage('Podaj status aktywnosci'),
], update);

// DELETE /api/services/:id - usun usluge (admin)
router.delete('/:id', authMiddleware, requireRole('admin'), remove);

module.exports = router;