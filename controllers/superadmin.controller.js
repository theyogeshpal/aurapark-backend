const Parking = require('../models/Parking');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const DailyParking = require('../models/DailyParking');

exports.getDashboard = async (req, res) => {
  try {
    const totalSpots = await Parking.countDocuments({ verification: true });
    const pendingRequests = await Parking.countDocuments({ verification: false });
    const totalContacts = await Contact.countDocuments();
    const recentFeedback = await Contact.find().sort({ createdAt: -1 }).limit(5);

    // Monthly chart — last 12 months
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

    res.json({ success: true, data: { totalSpots, pendingRequests, totalContacts, recentFeedback, monthlyChart: monthlyData } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, count: admins.length, data: admins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
