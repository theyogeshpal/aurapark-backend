const DailyParking = require('../models/DailyParking');
const Parking = require('../models/Parking');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getPreBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ parkingId: req.user.parkingId, status: 'prebooked' }).sort({ date: 1, time: 1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.checkIn = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, parkingId: req.user.parkingId, status: 'prebooked' });
    if (!booking) return res.status(404).json({ success: false, message: 'Pre-booking not found' });

    const user = await User.findById(booking.userId).select('name');
    const now = new Date();
    const actualInTime = now.toTimeString().substring(0, 5);
    const actualDate = now.toISOString().split('T')[0];

    const dailyRecord = await DailyParking.create({
      parkingId: req.user.parkingId,
      vehiclenumber: booking.vehicleNumber || booking.vehicleType,
      ownername: user?.name || 'Online User',
      type: booking.vehicleType,
      date: actualDate,
      intime: actualInTime,
      outtime: '-',
      amount: booking.totalPrice,
      source: 'online',
      bookingRef: booking.bookingRef,
      bookingId: booking._id,
      duration: booking.duration
    });

    booking.status = 'ongoing';
    booking.dailyParkingId = dailyRecord._id;
    await booking.save();

    res.json({ success: true, message: 'Check-in successful', data: dailyRecord });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getActive = async (req, res) => {
  try {
    const active = await DailyParking.find({ parkingId: req.user.parkingId, outtime: '-' });
    res.json({ success: true, count: active.length, data: active });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await DailyParking.find({ parkingId: req.user.parkingId }).sort({ createdAt: -1 });
    res.json({ success: true, count: history.length, data: history });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.parkVehicle = async (req, res) => {
  try {
    const { vehiclenumber, ownername, type } = req.body;
    if (!vehiclenumber || !ownername || !type) return res.status(400).json({ success: false, message: 'Vehicle number, owner name and type required' });

    const alreadyParked = await DailyParking.findOne({ vehiclenumber: vehiclenumber.toUpperCase(), outtime: '-' });
    if (alreadyParked) return res.status(409).json({ success: false, message: 'Vehicle is already parked' });

    const now = new Date();
    const entry = await DailyParking.create({
      parkingId: req.user.parkingId,
      vehiclenumber: vehiclenumber.toUpperCase(),
      ownername, type,
      date: now.toISOString().split('T')[0],
      intime: now.toTimeString().substring(0, 5),
      outtime: '-', amount: null
    });
    res.status(201).json({ success: true, message: `Vehicle ${entry.vehiclenumber} parked successfully`, data: entry });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.exitVehicle = async (req, res) => {
  try {
    const record = await DailyParking.findOne({ _id: req.params.id, parkingId: req.user.parkingId });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    if (record.outtime !== '-') return res.status(400).json({ success: false, message: 'Vehicle already checked out' });

    const parking = await Parking.findById(req.user.parkingId);
    const now = new Date();
    const outtime = now.toTimeString().substring(0, 5);

    const [inH, inM] = record.intime.split(':').map(Number);
    const [outH, outM] = outtime.split(':').map(Number);
    const hours = Math.max(1, Math.ceil(((outH * 60 + outM) - (inH * 60 + inM)) / 60));
    const amount = hours * parseInt(parking?.hourrate || 20);

    record.outtime = outtime;
    record.amount = amount;
    await record.save();
    res.json({ success: true, message: 'Vehicle checked out', data: record });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.completePayment = async (req, res) => {
  try {
    const record = await DailyParking.findOne({ _id: req.params.id, parkingId: req.user.parkingId });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    record.paymentStatus = 'completed';
    await record.save();
    res.json({ success: true, message: 'Payment marked as completed', data: record });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await DailyParking.findOneAndDelete({ _id: req.params.id, parkingId: req.user.parkingId });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReceipt = async (req, res) => {
  try {
    const record = await DailyParking.findOne({ _id: req.params.id, parkingId: req.user.parkingId });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    const parking = await Parking.findById(req.user.parkingId);
    res.json({ success: true, data: { ...record.toObject(), parkingName: parking?.parkingname, parkingAddress: parking?.address } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
