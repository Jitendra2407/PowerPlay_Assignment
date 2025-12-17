require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seed');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedDatabase();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
