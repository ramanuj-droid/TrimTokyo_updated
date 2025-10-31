const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');

const router = express.Router();

// Admin dashboard stats
router.get('/stats', auth('admin'), async (req, res) => {
  try {
    const users = await User.countDocuments();
    const barbers = await Barber.countDocuments();
    const bookings = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'pending' });
    res.json({ users, barbers, bookings, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list users
router.get('/users', auth('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list barbers
router.get('/barbers', auth('admin'), async (req, res) => {
  try {
    const barbers = await Barber.find().select('-password');
    res.json({ barbers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create dummy data endpoint (for development only)
router.post('/seed', auth('admin'), async (req, res) => {
  try {
    // create some dummy barbers and users and bookings
    await User.deleteMany({});
    await Barber.deleteMany({});
    await Booking.deleteMany({});

    const users = await User.create([
      { name: 'Alice', email: 'alice@example.com', password: 'pass1234' },
      { name: 'Bob', email: 'bob@example.com', password: 'pass1234' }
    ]);

    const barbers = await Barber.create([
      { name: 'Kenji', email: 'kenji@trimtokyo.com', password: 'barber123', phone: '9999999999', status: 'available', location: { type: 'Point', coordinates: [139.6917, 35.6895] } },
      { name: 'Hiro', email: 'hiro@trimtokyo.com', password: 'barber123', phone: '8888888888', status: 'available', location: { type: 'Point', coordinates: [139.7000, 35.6895] } }
    ]);

    // Note: In production, passwords must be hashed. For seed route demonstration, we keep it simple.
    const bookings = await Booking.create([
      {
        user: users[0]._id,
        barber: barbers[0]._id,
        service: 'Haircut',
        price: 500,
        address: 'Shinjuku, Tokyo',
        coords: { type: 'Point', coordinates: [139.7000, 35.6938] },
        status: 'pending',
        paymentMethod: 'COD',
        paymentStatus: 'pending'
      },
      {
        user: users[1]._id,
        barber: barbers[1]._id,
        service: 'Beard Trim',
        price: 300,
        address: 'Shibuya, Tokyo',
        coords: { type: 'Point', coordinates: [139.7020, 35.6618] },
        status: 'accepted',
        paymentMethod: 'COD',
        paymentStatus: 'pending'
      }
    ]);

    res.json({ users, barbers, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
