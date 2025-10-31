const User = require('../models/User');
const Barber = require('../models/Barber');
const Booking = require('../models/Booking');

// ============================
// GET ALL USERS
// ============================
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

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
// GET ALL BOOKINGS
// ============================
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('barber', 'name email');
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// ============================
// DELETE USER/BARBER/BOOKING
// ============================
exports.deleteEntity = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    let model;

    if (type === 'user') model = User;
    else if (type === 'barber') model = Barber;
    else if (type === 'booking') model = Booking;
    else return res.status(400).json({ message: 'Invalid type' });

    await model.findByIdAndDelete(id);
    res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
