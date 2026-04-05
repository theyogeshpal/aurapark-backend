const router = require('express').Router();
const ctrl = require('../controllers/parking.controller');
const { verifyAdmin, verifySuperAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `parking_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get('/', ctrl.getAllVerified);
router.post('/request', upload.single('photo'), ctrl.addParkingRequest);

// Admin (must be before /:id to avoid conflict)
router.get('/admin/my-parking', verifyAdmin, ctrl.getAdminParking);
router.put('/admin/my-parking', verifyAdmin, ctrl.updateAdminParking);

router.get('/:id', ctrl.getById);

// SuperAdmin
router.get('/superadmin/all', verifySuperAdmin, ctrl.getAllParkings);
router.get('/superadmin/pending', verifySuperAdmin, ctrl.getPendingParkings);
router.put('/superadmin/:id/verify', verifySuperAdmin, ctrl.verifyParking);
router.delete('/superadmin/:id', verifySuperAdmin, ctrl.deleteParking);

module.exports = router;
