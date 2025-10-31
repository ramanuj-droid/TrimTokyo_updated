const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'barber', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  // optional last known location for user
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  }
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
