const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/doctors - lista lekarzy (publiczny)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.specialty, u.first_name, u.last_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
});

module.exports = router;
