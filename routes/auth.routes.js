const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// User
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', verifyToken, ctrl.getProfile);
router.put('/profile', verifyToken, ctrl.updateProfile);

// Admin
router.post('/admin/login', ctrl.adminLogin);
router.put('/admin/change-password', verifyAdmin, ctrl.adminChangePassword);

// SuperAdmin
router.post('/superadmin/login', ctrl.superAdminLogin);

module.exports = router;
