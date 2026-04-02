const db = require('../db/data');

// Get user's bookings
exports.getUserBookings = (req, res) => {
  const { status } = req.query;
  let bookings = db.bookings.filter(b => b.userId === req.user.id);
  if (status) bookings = bookings.filter(b => b.status === status);
  res.json({ success: true, count: bookings.length, data: bookings });
};

// Create a new booking
exports.createBooking = (req, res) => {
  const { parkingId, date, time, duration } = req.body;
  if (!parkingId || !date || !time || !duration) return res.status(400).json({ success: false, message: 'parkingId, date, time and duration are required' });

  const parking = db.parkings.find(p => p.id === parseInt(parkingId) && p.verification);
  if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });

  const totalPrice = parseInt(duration) * parseInt(parking.hourrate);
  const booking = {
    id: db.nextId('bookings'),
    userId: req.user.id,
    parkingId: parseInt(parkingId),
    parkingName: parking.parkingname,
    location: `${parking.city}, ${parking.state}`,
    type: parking.type === 'Bike' ? 'BIKE PARKING' : 'CAR PARKING',
    date, time,
    duration: parseInt(duration),
    totalPrice,
    status: 'ongoing',
    rating: null,
    image: parking.photo,
    createdAt: new Date()
  };
  db.bookings.push(booking);
  res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
};

// Cancel a booking
exports.cancelBooking = (req, res) => {
  const idx = db.bookings.findIndex(b => b.id === parseInt(req.params.id) && b.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (db.bookings[idx].status !== 'ongoing') return res.status(400).json({ success: false, message: 'Only ongoing bookings can be cancelled' });
  db.bookings[idx].status = 'cancelled';
  res.json({ success: true, message: 'Booking cancelled', data: db.bookings[idx] });
};

// Get single booking detail
exports.getBookingById = (req, res) => {
  const booking = db.bookings.find(b => b.id === parseInt(req.params.id) && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
};
