const Booking = require('../models/Booking');
const Parking = require('../models/Parking');

exports.getUserBookings = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createBooking = async (req, res) => {
  try {
    const { parkingId, date, time, duration } = req.body;
    if (!parkingId || !date || !time || !duration) return res.status(400).json({ success: false, message: 'parkingId, date, time and duration are required' });

    const parking = await Parking.findOne({ _id: parkingId, verification: true });
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });

    const totalPrice = parseInt(duration) * parseInt(parking.hourrate);
    const booking = await Booking.create({
      userId: req.user.id, parkingId,
      parkingName: parking.parkingname,
      location: `${parking.city}, ${parking.state}`,
      type: parking.type === 'Bike' ? 'BIKE PARKING' : 'CAR PARKING',
      date, time, duration: parseInt(duration), totalPrice, status: 'ongoing'
    });
    res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'ongoing') return res.status(400).json({ success: false, message: 'Only ongoing bookings can be cancelled' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
