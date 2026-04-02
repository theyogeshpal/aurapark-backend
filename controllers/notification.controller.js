const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.filter === 'unread') filter.read = false;
    if (req.query.filter === 'promo') filter.type = 'promo';
    const notifs = await Notification.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: notifs.length, data: notifs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true }, { new: true });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Marked as read', data: notif });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
