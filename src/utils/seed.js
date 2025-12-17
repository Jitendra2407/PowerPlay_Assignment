const Event = require('../models/Event');

const seedDatabase = async () => {
  try {
    const existingEvent = await Event.findOne({ eventId: 'node-meetup-2025' });

    if (!existingEvent) {
      await Event.create({
        eventId: 'node-meetup-2025',
        name: 'Node.js Meet-up',
        totalSeats: 500,
        availableSeats: 500,
        version: 0
      });
      console.log('Database seeded with initial event');
    } else {
      console.log('Initial event already exists');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedDatabase;
