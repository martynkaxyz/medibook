const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { body } = require('express-validator');

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);

module.exports = router;