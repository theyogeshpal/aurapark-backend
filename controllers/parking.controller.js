const Parking = require('../models/Parking');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// ─── PUBLIC ──────────────────────────────────────────────
exports.getAllVerified = async (req, res) => {
  try {
    const { city, type, q } = req.query;
    const filter = { verification: true };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.$or = [{ type }, { type: 'Both' }];
    if (q) filter.$or = [{ parkingname: { $regex: q, $options: 'i' } }, { city: { $regex: q, $options: 'i' } }];
    const parkings = await Parking.find(filter);
    res.json({ success: true, count: parkings.length, data: parkings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });
    res.json({ success: true, data: parking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addParkingRequest = async (req, res) => {
  try {
    const { name, email, mobile, parkingName, address, city, state, map, type, carSpace, bikeSpace, hourRate, operatingHours, covered, evCharging } = req.body;
    if (!name || !email || !mobile || !address || !city || !state || !map || !hourRate || !operatingHours)
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });

    const parking = await Parking.create({
      parkingname: parkingName || `${name}'s Parking`,
      ownername: name, email, mobile, address, city, state, map,
      type: type || 'Both', bikespace: bikeSpace || '0', carspace: carSpace || '0',
      hourrate: hourRate, operatinghours: operatingHours,
      covered: covered || false, evcharging: evCharging || false, verification: false
    });
    res.status(201).json({ success: true, message: 'Parking request submitted for review', data: parking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── ADMIN ───────────────────────────────────────────────
exports.getAdminParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.user.parkingId);
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });
    res.json({ success: true, data: parking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateAdminParking = async (req, res) => {
  try {
    const allowed = ['parkingname', 'hourrate', 'operatinghours', 'address', 'city', 'state', 'map', 'bikespace', 'carspace', 'covered', 'evcharging'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const parking = await Parking.findByIdAndUpdate(req.user.parkingId, update, { new: true });
    res.json({ success: true, message: 'Parking updated', data: parking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── SUPERADMIN ──────────────────────────────────────────
exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.json({ success: true, count: parkings.length, data: parkings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getPendingParkings = async (req, res) => {
  try {
    const pending = await Parking.find({ verification: false });
    res.json({ success: true, count: pending.length, data: pending });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.verifyParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(req.params.id, { verification: true }, { new: true });
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });

    // Create admin account for parking owner if not already exists
    const existing = await Admin.findOne({ email: parking.email });
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: parking.ownername,
        email: parking.email,
        password: hashed,
        role: 'admin',
        parkingId: parking._id,
        city: parking.city
      });
    }

    res.json({ success: true, message: 'Parking verified and admin account created', data: parking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });

    // Delete associated admin account
    await Admin.findOneAndDelete({ email: parking.email, role: 'admin' });

    res.json({ success: true, message: 'Parking and associated admin deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
