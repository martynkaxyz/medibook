const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Rejestracja
const register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    // Sprawdz czy email juz istnieje
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email jest już zajęty' });
    }

    // Hashuj haslo
    const password_hash = await bcrypt.hash(password, 12);

    // Zapisz usera
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role',
      [email, password_hash, first_name, last_name]
    );

    const user = result.rows[0];

    // Wygeneruj token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Logowanie
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Znajdz usera
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    const user = result.rows[0];

    // Sprawdz czy konto nie jest zablokowane
    if (user.is_blocked) {
      return res.status(403).json({ error: 'Konto zostało zablokowane' });
    }

    // Sprawdz haslo
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      // Zwieksz licznik nieudanych prob
      await pool.query(
        'UPDATE users SET login_attempts = login_attempts + 1, is_blocked = (login_attempts + 1 >= 5) WHERE id = $1',
        [user.id]
      );
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Reset licznika po udanym logowaniu
    await pool.query(
      'UPDATE users SET login_attempts = 0 WHERE id = $1',
      [user.id]
    );

    // Wygeneruj token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

module.exports = { register, login };