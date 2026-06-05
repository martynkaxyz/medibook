const AdminModel = require('../models/admin.model');
const { validationResult } = require('express-validator');

// Pobierz wszystkich uzytkownikow
const getAllUsers = async (req, res) => {
  try {
    const users = await AdminModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Zmien role lub zablokuj usera
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { role, is_blocked } = req.body;
    const user = await AdminModel.updateUser(req.params.id, role, is_blocked);
    if (!user) return res.status(404).json({ error: 'Uzytkownik nie znaleziony' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Statystyki
const getStats = async (req, res) => {
  try {
    const stats = await AdminModel.getStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

module.exports = { getAllUsers, updateUser, getStats };