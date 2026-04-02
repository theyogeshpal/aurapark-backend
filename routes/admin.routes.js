const router = require('express').Router();
const adminCtrl = require('../controllers/admin.controller');
const notifCtrl = require('../controllers/notification.controller');
const { verifyAdmin, verifyToken } = require('../middleware/auth.middleware');

// Admin dashboard
router.get('/dashboard', verifyAdmin, adminCtrl.getDashboard);

// Notifications (user)
router.get('/notifications', verifyToken, notifCtrl.getNotifications);
router.put('/notifications/:id/read', verifyToken, notifCtrl.markRead);
router.put('/notifications/read-all', verifyToken, notifCtrl.markAllRead);

module.exports = router;
