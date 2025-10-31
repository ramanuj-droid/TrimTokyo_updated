const Booking = require('../models/Booking');
const Barber = require('../models/Barber');
const User = require('../models/User');

// ============================
// CREATE BOOKING
// ============================
exports.createBooking = async (req, res) => {
  try {
    const { userId, barberId, serviceType, amount, paymentMethod, location } = req.body;

    const newBooking = await Booking.create({
      user: userId,
      barber: barberId,
      serviceType,
      amount,
      paymentMethod,
      location,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// ============================
// UPDATE BARBER LOCATION (for map tracking)
// ============================
exports.updateBarberLocation = async (req, res) => {
  try {
    const { barberId, lat, lng } = req.body;
    const barber = await Barber.findByIdAndUpdate(
      barberId,
      { currentLocation: { lat, lng } },
      { new: true }
    );
    res.status(200).json({ message: 'Location updated', barber });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// ============================
// GET BOOKING DETAILS
// ============================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('barber', 'name email currentLocation');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// ============================
// UPDATE BOOKING STATUS (by Barber or Admin)
// ============================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const updated = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    res.status(200).json({ message: 'Booking status updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};
