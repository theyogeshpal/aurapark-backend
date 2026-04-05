const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingRef:  { type: String, unique: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  parkingName: { type: String },
  parkingAddress: { type: String },
  ownerName:   { type: String },
  ownerMobile: { type: String },
  location:    { type: String },
  type:        { type: String },
  vehicleType: { type: String, default: 'Car' },
  vehicleNumber: { type: String, default: '' },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  endTime:     { type: String },
  duration:    { type: Number, required: true },
  totalPrice:  { type: Number, required: true },
  hourRate:    { type: Number },
  status:      { type: String, enum: ['prebooked', 'ongoing', 'completed', 'cancelled'], default: 'prebooked' },
  cancelReason: { type: String, default: '' },
  rating:      { type: Number, default: null },
  dailyParkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyParking', default: null },
}, { timestamps: true });

// Auto-generate bookingRef before save
bookingSchema.pre('save', async function() {
  if (!this.bookingRef) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingRef = `AP-${Date.now().toString(36).toUpperCase()}-${(count + 1).toString().padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
