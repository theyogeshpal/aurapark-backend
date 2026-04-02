const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, default: 'admin' },
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', default: null },
  city:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
