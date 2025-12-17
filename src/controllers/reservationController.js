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

const createReservation = async (req, res) => {
  res.status(200).json({ message: 'Validation passed' });
};

module.exports = {
  getEventSummary,
  createReservation
};
