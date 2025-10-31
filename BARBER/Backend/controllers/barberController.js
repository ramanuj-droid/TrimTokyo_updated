const Barber = require('../models/Barber');
const Booking = require('../models/Booking');

// ============================
// GET ALL BARBERS
// ============================
exports.getAllBarbers = async (req, res, next) => {
  try {
    const barbers = await Barber.find();
    res.status(200).json(barbers);
  } catch (error) {
    next(error);
  }
};

// ============================
// UPDATE BARBER AVAILABILITY
// ============================
exports.updateAvailability = async (req, res, next) => {
  try {
    const { barberId, isAvailable } = req.body;
    const barber = await Barber.findByIdAndUpdate(
      barberId,
      { isAvailable },
      { new: true }
    );
    res.status(200).json({ message: 'Availability updated', barber });
  } catch (error) {
    next(error);
  }
};

// ============================
// UPDATE BARBER LOCATION
// ============================
exports.updateLocation = async (req, res, next) => {
  try {
    const { barberId, lat, lng } = req.body;
    const barber = await Barber.findByIdAndUpdate(
      barberId,
      { currentLocation: { lat, lng } },
      { new: true }
    );
    res.status(200).json({ message: 'Location updated', barber });
  } catch (error) {
    next(error);
  }
};

// ============================
// GET BARBER BOOKINGS
// ============================
exports.getBarberBookings = async (req, res, next) => {
  try {
    const { barberId } = req.params;
    const bookings = await Booking.find({ barber: barberId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
