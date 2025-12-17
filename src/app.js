const express = require('express');

const app = express();

const reservationRoutes = require('./routes/reservationRoutes');

app.use(express.json());

app.use('/reservations', reservationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
