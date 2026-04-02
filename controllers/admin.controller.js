const db = require('../db/data');

exports.getDashboard = (req, res) => {
  const parkingId = req.user.parkingId;
  const parking = db.parkings.find(p => p.id === parkingId);
  const allRecords = db.dailyParkings.filter(d => d.parkingId === parkingId);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = allRecords.filter(d => d.date === today);
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdayRecords = allRecords.filter(d => d.date === yesterdayDate);

  const todayRevenue = todayRecords.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalRevenue = allRecords.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeVehicles = allRecords.filter(d => d.outtime === '-').length;

  const totalSpaces = parseInt(parking?.bikespace || 0) + parseInt(parking?.carspace || 0);
  const availableSpaces = totalSpaces - activeVehicles;
  const occupancyPercent = totalSpaces > 0 ? Math.round((activeVehicles / totalSpaces) * 100) : 0;

  const incrementRate = yesterdayRecords.length > 0
    ? Math.round(((todayRecords.length - yesterdayRecords.length) / yesterdayRecords.length) * 100)
    : 0;

  // Weekly chart data
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    weeklyData.push({ day, count: allRecords.filter(r => r.date === dateStr).length });
  }

  res.json({
    success: true,
    data: {
      parkingName: parking?.parkingname,
      city: parking?.city,
      todayParking: todayRecords.length,
      totalParking: allRecords.length,
      todayRevenue,
      totalRevenue,
      activeVehicles,
      availableSpaces,
      totalSpaces,
      occupancyPercent,
      incrementRate,
      weeklyChart: weeklyData
    }
  });
};
