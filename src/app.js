const express = require('express');

const app = express();

const reservationRoutes = require('./routes/reservationRoutes');

const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

app.use('/reservations', reservationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TicketBoss API' });
});

app.use(errorHandler);

module.exports = app;
