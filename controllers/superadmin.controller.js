const db = require('../db/data');

exports.getDashboard = (req, res) => {
  const totalSpots = db.parkings.filter(p => p.verification).length;
  const pendingRequests = db.parkings.filter(p => !p.verification).length;
  const totalContacts = db.contacts.length;
  const recentFeedback = db.contacts.slice(-5).reverse();

  // Monthly chart data (last 12 months)
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const monthStr = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = db.dailyParkings.filter(dp => dp.date?.startsWith(monthStr)).length;
    monthlyData.push({ month, count });
  }

  res.json({
    success: true,
    data: {
      totalSpots,
      pendingRequests,
      totalContacts,
      recentFeedback,
      monthlyChart: monthlyData
    }
  });
};

exports.getAllAdmins = (req, res) => {
  const admins = db.admins.map(({ password: _, ...a }) => a);
  res.json({ success: true, count: admins.length, data: admins });
};
