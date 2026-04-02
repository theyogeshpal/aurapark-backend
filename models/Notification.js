const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  target:    { type: String, enum: ['admin', 'user', 'both'], required: true },
  sentBy:    { type: String, default: 'superadmin' },
  readBy:    [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
