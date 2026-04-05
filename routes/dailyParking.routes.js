const router = require('express').Router();
const ctrl = require('../controllers/dailyParking.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

router.get('/prebookings', verifyAdmin, ctrl.getPreBookings);
router.put('/checkin/:id', verifyAdmin, ctrl.checkIn);
router.get('/active', verifyAdmin, ctrl.getActive);
router.get('/history', verifyAdmin, ctrl.getHistory);
router.post('/park', verifyAdmin, ctrl.parkVehicle);
router.put('/exit/:id', verifyAdmin, ctrl.exitVehicle);
router.put('/payment/:id', verifyAdmin, ctrl.completePayment);
router.get('/receipt/:id', verifyAdmin, ctrl.getReceipt);
router.delete('/:id', verifyAdmin, ctrl.deleteRecord);

module.exports = router;
