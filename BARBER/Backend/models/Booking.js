const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true },
  service: { type: String, required: true },
  price: { type: Number, default: 0 },
  address: { type: String, required: true },
  coords: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat] of user address
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'on_the_way', 'arrived', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  eta: { type: Number }, // minutes estimate
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.index({ coords: '2dsphere' });

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
