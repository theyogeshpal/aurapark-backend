const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, ctrl.getUserBookings);
router.post('/', verifyToken, ctrl.createBooking);
router.get('/:id', verifyToken, ctrl.getBookingById);
router.put('/:id/cancel', verifyToken, ctrl.cancelBooking);

module.exports = router;
