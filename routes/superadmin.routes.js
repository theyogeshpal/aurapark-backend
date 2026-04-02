const router = require('express').Router();
const ctrl = require('../controllers/superadmin.controller');
const { verifySuperAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard', verifySuperAdmin, ctrl.getDashboard);
router.get('/admins', verifySuperAdmin, ctrl.getAllAdmins);

// Users CRUD
router.get('/users', verifySuperAdmin, ctrl.getAllUsers);
router.post('/users', verifySuperAdmin, ctrl.addUser);
router.get('/users/:id', verifySuperAdmin, ctrl.getUserById);
router.put('/users/:id', verifySuperAdmin, ctrl.updateUser);
router.delete('/users/:id', verifySuperAdmin, ctrl.deleteUser);

module.exports = router;
