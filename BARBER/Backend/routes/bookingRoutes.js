const express = require('express');
const auth = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const Barber = require('../models/Barber');
const User = require('../models/User');

const router = express.Router();

// Public: get all bookings (for admin or debug) - protected to admin
router.get('/', auth('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', '-password').populate('barber', '-password');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin or barber: assign booking to a barber (admin only in this implementation)
router.post('/:id/assign', auth('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { barberId } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const barber = await Barber.findById(barberId);
    if (!barber) return res.status(404).json({ message: 'Barber not found' });

    booking.barber = barberId;
    booking.status = 'accepted';
    await booking.save();

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking details (protected to involved parties or admin)
router.get('/:id', auth(['admin', 'user', 'barber']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', '-password').populate('barber', '-password');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const requesterId = req.user.id || req.user._id?.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && booking.user._id.toString() !== requesterId && booking.barber._id.toString() !== requesterId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
