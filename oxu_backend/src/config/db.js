const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('strictQuery', true);

async function connectDB() {
  await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB Atlas ulandi: ${mongoose.connection.name}`);

  mongoose.connection.on('error', (e) => console.error('MongoDB xatosi:', e.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB uzildi'));
}

module.exports = connectDB;
