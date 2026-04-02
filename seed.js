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

  // ── Parkings ───────────────────────────────────────────
  const parkings = await Parking.insertMany([
    { parkingname: 'Central City Parking', ownername: 'Rajesh Kumar',  email: 'rajesh@email.com',  mobile: '9876543210', address: '123 MG Road, Near City Mall',      city: 'Delhi',    state: 'Delhi',       map: 'https://maps.google.com/?q=Delhi',     type: 'Both', bikespace: '50', carspace: '30', hourrate: '20', operatinghours: '6AM - 11PM', covered: true,  evcharging: false, verification: true  },
    { parkingname: 'Green Park Parking',   ownername: 'Sunita Sharma', email: 'sunita@email.com',  mobile: '9765432109', address: '45 Sector 18, Near Metro',          city: 'Noida',    state: 'UP',          map: 'https://maps.google.com/?q=Noida',     type: 'Bike', bikespace: '40', carspace: '0',  hourrate: '15', operatinghours: '7AM - 10PM', covered: false, evcharging: false, verification: true  },
    { parkingname: 'Mall Road Parking',    ownername: 'Amit Verma',    email: 'amit@email.com',    mobile: '9654321098', address: '78 DLF Phase 2, Cyber Hub',         city: 'Gurgaon',  state: 'Haryana',     map: 'https://maps.google.com/?q=Gurgaon',   type: 'Car',  bikespace: '0',  carspace: '40', hourrate: '25', operatinghours: '24 Hours',   covered: true,  evcharging: true,  verification: true  },
    { parkingname: 'Vikram Parking Zone',  ownername: 'Vikram Nair',   email: 'vikram@email.com',  mobile: '9543210987', address: '12 Andheri West, Near Station',     city: 'Mumbai',   state: 'Maharashtra', map: 'https://maps.google.com/?q=Mumbai',    type: 'Both', bikespace: '30', carspace: '20', hourrate: '18', operatinghours: '8AM - 9PM',  covered: false, evcharging: false, verification: false },
    { parkingname: 'Patel Parking Hub',    ownername: 'Meena Patel',   email: 'meena@email.com',   mobile: '9432109876', address: '56 CG Road, Navrangpura',           city: 'Ahmedabad',state: 'Gujarat',     map: 'https://maps.google.com/?q=Ahmedabad', type: 'Bike', bikespace: '60', carspace: '0',  hourrate: '12', operatinghours: '6AM - 10PM', covered: false, evcharging: false, verification: false },
  ]);
  console.log(`✓ Seeded ${parkings.length} parkings`);

  // ── Admin (linked to first parking) ───────────────────
  const admins = await Admin.insertMany([
    { name: 'Admin User', email: 'admin@aurapark.in', password: bcrypt.hashSync('admin123', 10), role: 'admin', parkingId: parkings[0]._id, city: 'Delhi' },
  ]);
  console.log(`✓ Seeded ${admins.length} admins`);

  // ── Daily Parkings ─────────────────────────────────────
  const dailyParkings = await DailyParking.insertMany([
    { parkingId: parkings[0]._id, vehiclenumber: 'UP32AB1234', ownername: 'Rahul Sharma', type: '2W', date: '2025-01-15', intime: '09:30', outtime: '11:45', amount: 50  },
    { parkingId: parkings[0]._id, vehiclenumber: 'DL01CA5678', ownername: 'Priya Singh',  type: '4W', date: '2025-01-15', intime: '10:15', outtime: '14:30', amount: 120 },
    { parkingId: parkings[0]._id, vehiclenumber: 'MH12DE9012', ownername: 'Amit Kumar',   type: '2W', date: '2025-01-15', intime: '11:00', outtime: '-',     amount: null },
    { parkingId: parkings[0]._id, vehiclenumber: 'RJ14GH3456', ownername: 'Sunita Devi',  type: '4W', date: '2025-01-14', intime: '08:00', outtime: '10:00', amount: 80  },
    { parkingId: parkings[0]._id, vehiclenumber: 'KA05IJ7890', ownername: 'Vikram Nair',  type: '2W', date: '2025-01-14', intime: '13:00', outtime: '15:30', amount: 60  },
  ]);
  console.log(`✓ Seeded ${dailyParkings.length} daily parking records`);

  // ── Bookings ───────────────────────────────────────────
  const bookings = await Booking.insertMany([
    { userId: users[0]._id, parkingId: parkings[0]._id, parkingName: 'Central City Parking', location: 'Delhi',   type: 'CAR PARKING',  date: '2025-01-15', time: '10:00', duration: 3, totalPrice: 60,  status: 'completed', rating: 4.5 },
    { userId: users[0]._id, parkingId: parkings[1]._id, parkingName: 'Green Park Parking',   location: 'Noida',   type: 'BIKE PARKING', date: '2025-01-16', time: '09:00', duration: 2, totalPrice: 30,  status: 'ongoing',   rating: 4.2 },
    { userId: users[0]._id, parkingId: parkings[2]._id, parkingName: 'Mall Road Parking',    location: 'Gurgaon', type: 'CAR PARKING',  date: '2025-01-10', time: '14:00', duration: 4, totalPrice: 100, status: 'cancelled', rating: 4.8 },
  ]);
  console.log(`✓ Seeded ${bookings.length} bookings`);

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
