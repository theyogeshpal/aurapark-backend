const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { verifyAdmin, verifySuperAdmin, verifyToken } = require('../middleware/auth.middleware');

// SuperAdmin routes
router.post('/',       verifySuperAdmin, ctrl.sendNotification);
router.get('/all',     verifySuperAdmin, ctrl.getAllNotifications);

// Admin routes — must be before /:id
router.get('/admin',          verifyAdmin, ctrl.getAdminNotifications);
router.put('/admin/:id/read', verifyAdmin, ctrl.markAdminRead);

// User routes
router.get('/user',          verifyToken, ctrl.getUserNotifications);
router.put('/user/read-all', verifyToken, ctrl.markAllUserRead);
router.put('/user/:id/read', verifyToken, ctrl.markUserRead);

// SuperAdmin delete — keep at bottom to avoid conflict
router.delete('/:id', verifySuperAdmin, ctrl.deleteNotification);

module.exports = router;
