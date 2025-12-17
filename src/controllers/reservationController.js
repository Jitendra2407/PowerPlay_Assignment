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

const cancelReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findOne({ reservationId });

    if (!reservation || reservation.status === 'cancelled') {
      return res.status(404).json({ message: 'Reservation not found or already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    await Event.findOneAndUpdate(
      { eventId: reservation.eventId },
      {
        $inc: { availableSeats: reservation.seats, version: 1 }
      }
    );

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getEventSummary,
  createReservation,
  cancelReservation
};
