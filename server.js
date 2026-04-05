const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/connect');
const app = express();

// Connect MongoDB
connectDB();

// Start cron jobs
require('./jobs/autoCancelJob');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/parkings', require('./routes/parking.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/daily-parking', require('./routes/dailyParking.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/superadmin', require('./routes/superadmin.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/faqs', require('./routes/faq.routes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'AuraPark API is running', version: '1.0.0' }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AuraPark API running on port ${PORT}`));
