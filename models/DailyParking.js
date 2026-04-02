const mongoose = require('mongoose');

const dailyParkingSchema = new mongoose.Schema({
  parkingId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  vehiclenumber: { type: String, required: true, uppercase: true },
  ownername:     { type: String, required: true },
  type:          { type: String, enum: ['2W', '4W'], required: true },
  date:          { type: String, required: true },
  intime:        { type: String, required: true },
  outtime:       { type: String, default: '-' },
  amount:        { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('DailyParking', dailyParkingSchema);
