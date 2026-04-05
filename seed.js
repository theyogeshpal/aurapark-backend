require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./db/connect');
const User = require('./models/User');
const Admin = require('./models/Admin');
const SuperAdmin = require('./models/SuperAdmin');
const Parking = require('./models/Parking');
const DailyParking = require('./models/DailyParking');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Notification = require('./models/Notification');

const seed = async () => {
  await connectDB();

  // Clear all collections
  await Promise.all([
    User.deleteMany({}), Admin.deleteMany({}), SuperAdmin.deleteMany({}),
    Parking.deleteMany({}), DailyParking.deleteMany({}),
    Booking.deleteMany({}), Contact.deleteMany({}), Notification.deleteMany({})
  ]);
  console.log('✓ Cleared all collections');

  // ── Users ──────────────────────────────────────────────
  const users = await User.insertMany([
    { name: 'Yogesh Pal',   email: 'yogesh@aurapark.in', password: bcrypt.hashSync('user123', 10), mobile: '9876543210', city: 'Delhi',  role: 'user', createdAt: new Date('2025-01-01') },
    { name: 'Priya Singh',  email: 'priya@email.com',    password: bcrypt.hashSync('user123', 10), mobile: '9765432109', city: 'Mumbai', role: 'user', createdAt: new Date('2025-01-05') },
  ]);
  console.log(`✓ Seeded ${users.length} users`);

  // ── SuperAdmin ─────────────────────────────────────────
  const superAdmins = await SuperAdmin.insertMany([
    { name: 'Super Admin', email: 'superadmin@aurapark.in', password: bcrypt.hashSync('super123', 10), role: 'superadmin' },
  ]);
  console.log(`✓ Seeded ${superAdmins.length} superadmins`);








  // ── Contacts ───────────────────────────────────────────
  const contacts = await Contact.insertMany([
    { name: 'Rahul Sharma', email: 'rahul@email.com', mobile: '9876543210', message: 'Great parking service, very convenient and affordable.' },
    { name: 'Priya Singh',  email: 'priya@email.com', mobile: '9765432109', message: 'Need more bike slots near the entrance gate.' },
    { name: 'Amit Kumar',   email: 'amit@email.com',  mobile: '9654321098', message: 'Staff is very helpful and cooperative. Keep it up!' },
  ]);
  console.log(`✓ Seeded ${contacts.length} contacts`);

  // ── Notifications ──────────────────────────────────────
  const notifications = await Notification.insertMany([
    { userId: users[0]._id, title: 'Welcome to AuraPark!',    message: 'Thanks for joining AuraPark. Start exploring parking spots near you.', type: 'success', read: false },
    { userId: users[0]._id, title: 'Limited Time Offer',      message: 'Get 20% off on your first 3 bookings. Use code AURA20.',               type: 'promo',   read: false },
    { userId: users[0]._id, title: 'New Spots in Your Area',  message: '5 new parking spots listed near your location.',                        type: 'info',    read: true  },
  ]);
  console.log(`✓ Seeded ${notifications.length} notifications`);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('─────────────────────────────────────');
  console.log('Login Credentials:');
  console.log('  User:       yogesh@aurapark.in   / user123');
  console.log('  Admin:      admin@aurapark.in    / admin123');
  console.log('  SuperAdmin: superadmin@aurapark.in / super123');
  console.log('─────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
