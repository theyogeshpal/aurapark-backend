const router = require('express').Router();
const ctrl = require('../controllers/parking.controller');
const { verifyAdmin, verifySuperAdmin } = require('../middleware/auth.middleware');

// Public
router.get('/', ctrl.getAllVerified);
router.get('/:id', ctrl.getById);
router.post('/request', ctrl.addParkingRequest);

// Admin
router.get('/admin/my-parking', verifyAdmin, ctrl.getAdminParking);
router.put('/admin/my-parking', verifyAdmin, ctrl.updateAdminParking);

// SuperAdmin
router.get('/superadmin/all', verifySuperAdmin, ctrl.getAllParkings);
router.get('/superadmin/pending', verifySuperAdmin, ctrl.getPendingParkings);
router.put('/superadmin/:id/verify', verifySuperAdmin, ctrl.verifyParking);
router.delete('/superadmin/:id', verifySuperAdmin, ctrl.deleteParking);

module.exports = router;
