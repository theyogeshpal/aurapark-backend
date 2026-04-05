const Booking = require('../models/Booking');
const Parking = require('../models/Parking');
const DailyParking = require('../models/DailyParking');
const User = require('../models/User');

// Calculate end time string from start time + duration hours
const calcEndTime = (timeStr, durationHours) => {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMins = h * 60 + m + durationHours * 60;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

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
    const { parkingId, date, time, duration, vehicleNumber, vehicleType } = req.body;
    if (!parkingId || !date || !time || !duration) return res.status(400).json({ success: false, message: 'parkingId, date, time and duration are required' });

    const parking = await Parking.findOne({ _id: parkingId, verification: true });
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });

    const user = await User.findById(req.user.id).select('-password');
    const totalPrice = parseInt(duration) * parseInt(parking.hourrate);
    const endTime = calcEndTime(time, parseInt(duration));
    const vType = parking.type === 'Bike' ? '2W' : '4W';
    const resolvedVehicleNumber = (vehicleNumber || '').toUpperCase() || (user?.name?.toUpperCase().replace(/\s/g, '') + 'XX').substring(0, 12);

    // Check duplicate vehicle booking for overlapping time on same date
    if (resolvedVehicleNumber) {
      const existing = await Booking.findOne({
        vehicleNumber: resolvedVehicleNumber,
        date,
        status: { $in: ['prebooked', 'ongoing'] }
      });
      if (existing) {
        return res.status(409).json({ success: false, message: `Vehicle ${resolvedVehicleNumber} already has an active booking on this date. Please cancel the existing booking first.` });
      }
    }

    // Create Booking record
    const booking = new Booking({
      userId: req.user.id,
      parkingId,
      parkingName: parking.parkingname,
      parkingAddress: parking.address,
      ownerName: parking.ownername,
      ownerMobile: parking.mobile,
      location: `${parking.city}, ${parking.state}`,
      type: parking.type === 'Bike' ? 'BIKE PARKING' : 'CAR PARKING',
      vehicleType: vehicleType || vType,
      vehicleNumber: resolvedVehicleNumber,
      date, time, endTime,
      duration: parseInt(duration),
      totalPrice,
      hourRate: parseInt(parking.hourrate),
      status: 'prebooked'
    });
    await booking.save();

    res.status(201).json({ success: true, message: 'Booking confirmed!', data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// Receipt — by bookingId
exports.getReceipt = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: {
        ...booking.toObject(),
        userName: user?.name,
        userEmail: user?.email,
        userMobile: user?.mobile
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!['ongoing', 'prebooked'].includes(booking.status)) return res.status(400).json({ success: false, message: 'Only active bookings can be cancelled' });
    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || 'Cancelled by user';
    await booking.save();
    if (booking.dailyParkingId) {
      await DailyParking.findByIdAndUpdate(booking.dailyParkingId, { outtime: 'CANCELLED', amount: 0 });
    }
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
