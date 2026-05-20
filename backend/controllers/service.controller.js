const ServiceModel = require('../models/service.model');
const { validationResult } = require('express-validator');

// Pobierz aktywne uslugi (publiczne)
const getActive = async (req, res) => {
  try {
    const services = await ServiceModel.getActive();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Pobierz wszystkie uslugi (admin)
const getAll = async (req, res) => {
  try {
    const services = await ServiceModel.getAll();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Dodaj usluge (admin)
const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, duration_minutes } = req.body;
    const service = await ServiceModel.create(name, duration_minutes);
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Edytuj usluge (admin)
const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, duration_minutes, is_active } = req.body;
    const service = await ServiceModel.update(
      req.params.id, name, duration_minutes, is_active
    );
    if (!service) return res.status(404).json({ error: 'Usluga nie znaleziona' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

// Usun usluge (admin)
const remove = async (req, res) => {
  try {
    const service = await ServiceModel.remove(req.params.id);
    if (!service) return res.status(404).json({ error: 'Usluga nie znaleziona' });
    res.json({ message: 'Usluga usunieta' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Blad serwera' });
  }
};

module.exports = { getActive, getAll, create, update, remove };