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

module.exports = router;