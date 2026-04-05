const cron = require('node-cron');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Runs every minute — checks prebooked bookings past 30 min grace period
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const prebookedList = await Booking.find({ status: 'prebooked' });

    for (const booking of prebookedList) {
      const [year, month, day] = booking.date.split('-').map(Number);
      const [hour, minute] = booking.time.split(':').map(Number);
      const bookingStart = new Date(year, month - 1, day, hour, minute, 0);

      const diffMins = (now - bookingStart) / 60000;

      if (diffMins > 30) {
        booking.status = 'cancelled';
        booking.cancelReason = 'Auto-cancelled: Vehicle did not check in within 30 minutes of scheduled time.';
        await booking.save();

        await Notification.create({
          title: 'Booking Auto-Cancelled',
          message: `Your booking at ${booking.parkingName} on ${booking.date} at ${booking.time} has been automatically cancelled because you did not check in within 30 minutes of your scheduled time.`,
          target: 'user',
          sentBy: 'system',
          userId: booking.userId,
          parkingId: booking.parkingId
        });

        await Notification.create({
          title: 'Pre-Booking Auto-Cancelled',
          message: `Booking ${booking.bookingRef} at ${booking.parkingName} was auto-cancelled. Customer did not check in within 30 minutes of scheduled time (${booking.time} on ${booking.date}).`,
          target: 'admin',
          sentBy: 'system',
          parkingId: booking.parkingId
        });
      }
    }
  } catch (err) {
    console.error('Auto-cancel job error:', err.message);
  }
});

console.log('Auto-cancel cron job started');
