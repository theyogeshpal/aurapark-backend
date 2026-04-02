const router = require('express').Router();
const adminCtrl = require('../controllers/admin.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Admin dashboard
router.get('/dashboard', verifyAdmin, adminCtrl.getDashboard);

module.exports = router;
