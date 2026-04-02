const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  parkingName: { type: String },
  location:    { type: String },
  type:        { type: String },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  duration:    { type: Number, required: true },
  totalPrice:  { type: Number, required: true },
  status:      { type: String, enum: ['ongoing', 'completed', 'cancelled'], default: 'ongoing' },
  rating:      { type: Number, default: null },
  image:       { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
