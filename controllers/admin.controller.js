const DailyParking = require('../models/DailyParking');
const Parking = require('../models/Parking');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

const getISTDate = (offsetDays = 0) => {
  const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - offsetDays * 86400000);
  return d.toISOString().split('T')[0];
};

exports.getDashboard = async (req, res) => {
  try {
    const parkingId = req.user.parkingId;
    if (!parkingId) return res.status(400).json({ success: false, message: 'No parking linked to this admin' });

    const pid = new mongoose.Types.ObjectId(parkingId);
    const parking = await Parking.findById(pid);
    const allRecords = await DailyParking.find({ parkingId: pid });

    const today = getISTDate(0);
    const yesterdayDate = getISTDate(1);

    const todayRecords = allRecords.filter(d => d.date === today);
    const yesterdayRecords = allRecords.filter(d => d.date === yesterdayDate);

    const todayRevenue = todayRecords.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalRevenue = allRecords.reduce((sum, d) => sum + (d.amount || 0), 0);
    const activeVehicles = allRecords.filter(d => d.outtime === '-').length;
    const prebookedCount = await Booking.countDocuments({ parkingId: pid, status: 'prebooked' });

    const totalSpaces = (parseInt(parking?.bikespace) || 0) + (parseInt(parking?.carspace) || 0);
    const availableSpaces = Math.max(0, totalSpaces - activeVehicles);
    const occupancyPercent = totalSpaces > 0 ? Math.round((activeVehicles / totalSpaces) * 100) : 0;
    const incrementRate = yesterdayRecords.length > 0
      ? Math.round(((todayRecords.length - yesterdayRecords.length) / yesterdayRecords.length) * 100)
      : todayRecords.length > 0 ? 100 : 0;

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getISTDate(i);
      const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - i * 86400000);
      const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayRecords = allRecords.filter(r => r.date === dateStr);
      weeklyData.push({ day, count: dayRecords.length, revenue: dayRecords.reduce((sum, r) => sum + (r.amount || 0), 0) });
    }

    const recentActivity = await DailyParking.find({ parkingId: pid }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        parkingName: parking?.parkingname || 'My Parking',
        city: parking?.city || '',
        todayParking: todayRecords.length,
        totalParking: allRecords.length,
        todayRevenue,
        totalRevenue,
        activeVehicles,
        availableSpaces,
        totalSpaces,
        occupancyPercent,
        incrementRate,
        prebookedCount,
        weeklyChart: weeklyData,
        recentActivity
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
