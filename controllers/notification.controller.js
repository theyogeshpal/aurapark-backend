const db = require('../db/data');

exports.getNotifications = (req, res) => {
  const { filter } = req.query;
  let notifs = db.notifications.filter(n => n.userId === req.user.id);
  if (filter === 'unread') notifs = notifs.filter(n => !n.read);
  if (filter === 'promo') notifs = notifs.filter(n => n.type === 'promo');
  res.json({ success: true, count: notifs.length, data: notifs });
};

exports.markRead = (req, res) => {
  const idx = db.notifications.findIndex(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Notification not found' });
  db.notifications[idx].read = true;
  res.json({ success: true, message: 'Marked as read', data: db.notifications[idx] });
};

exports.markAllRead = (req, res) => {
  db.notifications.forEach(n => { if (n.userId === req.user.id) n.read = true; });
  res.json({ success: true, message: 'All notifications marked as read' });
};
