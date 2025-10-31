require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Barber = require('./models/Barber');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Barber.deleteMany();

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', password: hashedPassword, role: 'user' },
      { name: 'Bob', email: 'bob@example.com', password: hashedPassword, role: 'user' },
    ]);

    const barbers = await Barber.insertMany([
      { name: 'Rajesh', email: 'rajesh@trimtokyo.com', password: hashedPassword, rating: 4.8, isAvailable: true },
      { name: 'Rohan', email: 'rohan@trimtokyo.com', password: hashedPassword, rating: 4.6, isAvailable: true },
    ]);

    console.log('✅ Database seeded successfully');
    console.log({ users, barbers });
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
