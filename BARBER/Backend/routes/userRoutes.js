const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { geocodeAddress } = require('../utils/mapAPI');

const router = express.Router();

// Get current user profile
router.get('/me', auth(['user', 'barber', 'admin']), async (req, res) => {
  try {
    // if admin token is not a DB user, user lookup may be missing
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json(user);
    }
    return res.json({ id: 'admin', name: 'Admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user location (from frontend)
router.post('/location', auth('user'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') return res.status(400).json({ message: 'Invalid coordinates' });
    await User.findByIdAndUpdate(req.user._id, {
      location: { type: 'Point', coordinates: [lng, lat] }
    });
    res.json({ message: 'Location updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book a barber
router.post('/book', auth('user'), async (req, res) => {
  try {
    const { barberId, service, price = 0, address } = req.body;
    if (!barberId || !service || !address) return res.status(400).json({ message: 'Missing fields' });

    // geocode address to get coords
    let geocoded;
    try {
      geocoded = await geocodeAddress(address);
    } catch (err) {
      // fallback: let booking still create with default coords
      geocoded = null;
    }

    const booking = await Booking.create({
      user: req.user._id,
      barber: barberId,
      service,
      price,
      address: geocoded ? geocoded.formattedAddress : address,
      coords: geocoded ? { type: 'Point', coordinates: [geocoded.lng, geocoded.lat] } : { type: 'Point', coordinates: [0, 0] },
      status: 'pending',
      paymentMethod: 'COD',
      paymentStatus: 'pending'
    });

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/bookings', auth('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('barber', '-password');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
