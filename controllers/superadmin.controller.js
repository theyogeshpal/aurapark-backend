const Parking = require('../models/Parking');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const DailyParking = require('../models/DailyParking');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const totalSpots = await Parking.countDocuments({ verification: true });
    const pendingRequests = await Parking.countDocuments({ verification: false });
    const totalContacts = await Contact.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentFeedback = await Contact.find().sort({ createdAt: -1 }).limit(5);
    const pendingParkings = await Parking.find({ verification: false }).sort({ createdAt: -1 }).limit(5);
    const totalRevenue = await DailyParking.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalBookings = await (require('../models/Booking')).countDocuments();

    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
      const count = await DailyParking.countDocuments({ date: { $gte: start, $lte: end } });
      monthlyData.push({ month, count });
    }

    res.json({ success: true, data: {
      totalSpots, pendingRequests, totalContacts, totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0, totalBookings,
      recentFeedback, pendingParkings, monthlyChart: monthlyData
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, count: admins.length, data: admins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── Users CRUD ────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, mobile, city, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, city, password: hashed });
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ success: true, message: 'User created', data: userData });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, mobile, city } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, mobile, city }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
