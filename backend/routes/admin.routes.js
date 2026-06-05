const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { getAllUsers, updateUser, getStats } = require('../controllers/admin.controller');

// GET /api/admin/users - wszyscy uzytkownicy
router.get('/users', authMiddleware, requireRole('admin'), getAllUsers);

// PATCH /api/admin/users/:id - zmien role lub zablokuj
router.patch('/users/:id', authMiddleware, requireRole('admin'), [
  body('role').isIn(['patient', 'doctor', 'admin']).withMessage('Nieprawidlowa rola'),
  body('is_blocked').isBoolean().withMessage('Podaj status blokady'),
], updateUser);

// GET /api/admin/stats - statystyki
router.get('/stats', authMiddleware, requireRole('admin'), getStats);

router.delete('/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const pool = require('../config/db');
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    res.json({ message: 'Użytkownik usunięty' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;