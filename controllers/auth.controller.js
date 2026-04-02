const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── USER ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, city } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password required' });
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password: bcrypt.hashSync(password, 10), mobile: mobile || '', city: city || '' });
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ success: true, message: 'Registered successfully', data: { user: userData, token: generateToken({ id: user._id, role: 'user' }) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const { password: _, ...userData } = user.toObject();
    res.json({ success: true, message: 'Login successful', data: { user: userData, token: generateToken({ id: user._id, role: 'user' }) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, city } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, mobile, city }, { new: true }).select('-password');
    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── ADMIN ───────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const { password: _, ...adminData } = admin.toObject();
    res.json({ success: true, message: 'Admin login successful', data: { admin: adminData, token: generateToken({ id: admin._id, role: 'admin', parkingId: admin.parkingId }) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.adminChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    if (!bcrypt.compareSync(oldPassword, admin.password)) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    admin.password = bcrypt.hashSync(newPassword, 10);
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── SUPERADMIN ──────────────────────────────────────────
exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sa = await SuperAdmin.findOne({ email });
    if (!sa || !bcrypt.compareSync(password, sa.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const { password: _, ...saData } = sa.toObject();
    res.json({ success: true, message: 'Super Admin login successful', data: { superadmin: saData, token: generateToken({ id: sa._id, role: 'superadmin' }) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
