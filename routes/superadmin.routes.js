const router = require('express').Router();
const ctrl = require('../controllers/superadmin.controller');
const { verifySuperAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard', verifySuperAdmin, ctrl.getDashboard);
router.get('/admins', verifySuperAdmin, ctrl.getAllAdmins);

module.exports = router;
