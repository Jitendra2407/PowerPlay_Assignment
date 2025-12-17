const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

const getEventSummary = async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: 'node-meetup-2025' });

    if (!event) {
      return res.status(500).json({ message: 'Event not found' });
    }

    const reservationCount = await Reservation.countDocuments({
      eventId: 'node-meetup-2025',
      status: 'confirmed'
    });

    res.json({
      eventId: event.eventId,
      name: event.name,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      reservationCount,
      version: event.version
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const { v4: uuidv4 } = require('uuid');

const createReservation = async (req, res) => {
  const { partnerId, seats } = req.body;
  const eventId = 'node-meetup-2025';

  try {
    const event = await Event.findOne({ eventId });

    if (!event) {
      return res.status(500).json({ message: 'Event not found' });
    }

    if (event.availableSeats < seats) {
      return res.status(409).json({ message: 'Not enough seats available' });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { eventId, version: event.version },
      {
        $inc: { availableSeats: -seats, version: 1 }
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(409).json({ message: 'Concurrency conflict, please try again' });
    }

    const reservation = await Reservation.create({
      reservationId: uuidv4(),
      partnerId,
      seats,
      status: 'confirmed',
      eventId
    });

    res.status(201).json({
      reservationId: reservation.reservationId,
      seats: reservation.seats,
      status: reservation.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getEventSummary,
  createReservation
};
