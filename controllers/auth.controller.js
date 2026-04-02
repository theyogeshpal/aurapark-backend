const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/data');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── USER ───────────────────────────────────────────────
exports.register = (req, res) => {
  const { name, email, password, mobile, city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password required' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ success: false, message: 'Email already registered' });

  const user = { id: db.nextId('users'), name, email, password: bcrypt.hashSync(password, 10), mobile: mobile || '', city: city || '', role: 'user', avatar: null, createdAt: new Date() };
  db.users.push(user);
  const { password: _, ...userData } = user;
  res.status(201).json({ success: true, message: 'Registered successfully', data: { user: userData, token: generateToken({ id: user.id, role: 'user' }) } });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  const { password: _, ...userData } = user;
  res.json({ success: true, message: 'Login successful', data: { user: userData, token: generateToken({ id: user.id, role: 'user' }) } });
};

exports.getProfile = (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password: _, ...userData } = user;
  res.json({ success: true, data: userData });
};

exports.updateProfile = (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
  const { name, mobile, city } = req.body;
  if (name) db.users[idx].name = name;
  if (mobile) db.users[idx].mobile = mobile;
  if (city) db.users[idx].city = city;
  const { password: _, ...userData } = db.users[idx];
  res.json({ success: true, message: 'Profile updated', data: userData });
};

// ─── ADMIN ──────────────────────────────────────────────
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  const admin = db.admins.find(a => a.email === email);
  if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const { password: _, ...adminData } = admin;
  res.json({ success: true, message: 'Admin login successful', data: { admin: adminData, token: generateToken({ id: admin.id, role: 'admin', parkingId: admin.parkingId }) } });
};

exports.adminChangePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const idx = db.admins.findIndex(a => a.id === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Admin not found' });
  if (!bcrypt.compareSync(oldPassword, db.admins[idx].password)) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  db.admins[idx].password = bcrypt.hashSync(newPassword, 10);
  res.json({ success: true, message: 'Password changed successfully' });
};

// ─── SUPERADMIN ─────────────────────────────────────────
exports.superAdminLogin = (req, res) => {
  const { email, password } = req.body;
  const sa = db.superadmins.find(s => s.email === email);
  if (!sa || !bcrypt.compareSync(password, sa.password)) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const { password: _, ...saData } = sa;
  res.json({ success: true, message: 'Super Admin login successful', data: { superadmin: saData, token: generateToken({ id: sa.id, role: 'superadmin' }) } });
};
