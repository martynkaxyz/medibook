const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const slotRoutes = require('./routes/slot.routes');
const serviceRoutes = require('./routes/service.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://medibook-amber.vercel.app'],
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/services', serviceRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediBook API dziala!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Nie znaleziono zasobu' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Blad serwera' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Serwer dziala na porcie ' + PORT);
});
