const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// SuperAdmin: send notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, target } = req.body;
    if (!title || !message || !target)
      return res.status(400).json({ success: false, message: 'Title, message and target are required' });
    const notif = await Notification.create({ title, message, target });
    res.status(201).json({ success: true, message: 'Notification sent', data: notif });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// SuperAdmin: get all
exports.getAllNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notifs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// SuperAdmin: delete
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Admin: get notifications
exports.getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user.id;
    const notifs = await Notification.find({ target: { $in: ['admin', 'both'] } }).sort({ createdAt: -1 });
    const data = notifs.map(n => ({
      ...n.toObject(),
      isRead: n.readBy.some(id => id.toString() === adminId)
    }));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// User: get notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifs = await Notification.find({ target: { $in: ['user', 'both'] } }).sort({ createdAt: -1 });
    const data = notifs.map(n => ({
      ...n.toObject(),
      isRead: n.readBy.some(id => id.toString() === userId)
    }));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Admin: mark read
exports.markAdminRead = async (req, res) => {
  try {
    const adminObjId = new mongoose.Types.ObjectId(req.user.id);
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: adminObjId } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// User: mark read
exports.markUserRead = async (req, res) => {
  try {
    const userObjId = new mongoose.Types.ObjectId(req.user.id);
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: userObjId } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// User: mark all read
exports.markAllUserRead = async (req, res) => {
  try {
    const userObjId = new mongoose.Types.ObjectId(req.user.id);
    await Notification.updateMany(
      { target: { $in: ['user', 'both'] }, readBy: { $ne: userObjId } },
      { $addToSet: { readBy: userObjId } }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
