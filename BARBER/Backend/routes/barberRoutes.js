const express = require('express');
const auth = require('../middleware/authMiddleware');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');

const router = express.Router();

// Barber: update status and location
router.post('/update-status', auth('barber'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['available', 'busy', 'offline'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    await Barber.findByIdAndUpdate(req.user._id, { status });
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Barber: update location
router.post('/location', auth('barber'), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') return res.status(400).json({ message: 'Invalid coordinates' });
    await Barber.findByIdAndUpdate(req.user._id, { location: { type: 'Point', coordinates: [lng, lat] } });
    res.json({ message: 'Location updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Barber: get assigned bookings
router.get('/bookings', auth('barber'), async (req, res) => {
  try {
    const bookings = await Booking.find({ barber: req.user._id }).populate('user', '-password');
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Barber: update booking status (e.g., accept, on_the_way, arrived, completed)
router.post('/booking/:id/status', auth('barber'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eta, paymentStatus } = req.body;
    const allowed = ['accepted', 'on_the_way', 'arrived', 'completed', 'cancelled'];
    if (status && !allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.barber.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your booking' });

    if (status) booking.status = status;
    if (typeof eta === 'number') booking.eta = eta;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
