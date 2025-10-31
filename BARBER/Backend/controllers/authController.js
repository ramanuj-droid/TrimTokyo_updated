const User = require('../models/User');
const Barber = require('../models/Barber');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ============================
// USER REGISTER
// ============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password, phone });
    const token = generateToken(newUser._id, 'user');

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// ============================
// LOGIN (USER/BARBER/ADMIN)
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let Model;
    if (role === 'user') Model = User;
    else if (role === 'barber') Model = Barber;
    else if (role === 'admin') Model = Admin;
    else return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Account not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, role);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
