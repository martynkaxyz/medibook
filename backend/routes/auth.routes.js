const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
], register);

router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);

// PATCH /api/auth/profile - edycja imienia i nazwiska
router.patch('/profile', authMiddleware, [
  body('first_name').notEmpty().trim().withMessage('Imię jest wymagane'),
  body('last_name').notEmpty().trim().withMessage('Nazwisko jest wymagane'),
], updateProfile);

// PATCH /api/auth/password - zmiana hasla
router.patch('/password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Podaj aktualne hasło'),
  body('newPassword').isLength({ min: 8 }).withMessage('Nowe hasło musi mieć min. 8 znaków'),
], changePassword);

module.exports = router;