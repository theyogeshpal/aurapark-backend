const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  parkingname:    { type: String, required: true },
  ownername:      { type: String, required: true },
  email:          { type: String, required: true },
  mobile:         { type: String, required: true },
  address:        { type: String, required: true },
  city:           { type: String, required: true },
  state:          { type: String, required: true },
  map:            { type: String, default: '' },
  type:           { type: String, enum: ['Bike', 'Car', 'Both'], default: 'Both' },
  bikespace:      { type: String, default: '0' },
  carspace:       { type: String, default: '0' },
  hourrate:       { type: String, required: true },
  operatinghours: { type: String, required: true },
  photo:          { type: String, default: null },
  covered:        { type: Boolean, default: false },
  evcharging:     { type: Boolean, default: false },
  verification:   { type: Boolean, default: false },
  upiId:          { type: String, default: '' },
  upiName:        { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Parking', parkingSchema);
