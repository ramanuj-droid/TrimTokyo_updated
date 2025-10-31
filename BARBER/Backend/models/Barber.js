const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  vehicle: { type: String }, // optional
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now }
});

barberSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Barber', barberSchema);
