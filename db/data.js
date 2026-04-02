// In-memory database — replace with real DB (MongoDB/MySQL) later

const bcrypt = require('bcryptjs');

const db = {
  users: [
    { id: 1, name: 'Yogesh Pal', email: 'yogesh@aurapark.in', password: bcrypt.hashSync('user123', 10), mobile: '9876543210', city: 'Delhi', role: 'user', avatar: null, createdAt: new Date('2025-01-01') },
    { id: 2, name: 'Priya Singh', email: 'priya@email.com', password: bcrypt.hashSync('user123', 10), mobile: '9765432109', city: 'Mumbai', role: 'user', avatar: null, createdAt: new Date('2025-01-05') },
  ],

  admins: [
    { id: 1, name: 'Admin User', email: 'admin@aurapark.in', password: bcrypt.hashSync('admin123', 10), role: 'admin', parkingId: 1, city: 'Delhi', createdAt: new Date('2025-01-01') },
  ],

  superadmins: [
    { id: 1, name: 'Super Admin', email: 'superadmin@aurapark.in', password: bcrypt.hashSync('super123', 10), role: 'superadmin', createdAt: new Date('2025-01-01') },
  ],

  parkings: [
    { id: 1, parkingname: 'Central City Parking', ownername: 'Rajesh Kumar', email: 'rajesh@email.com', mobile: '9876543210', address: '123 MG Road, Near City Mall', city: 'Delhi', state: 'Delhi', map: 'https://maps.google.com/?q=Delhi', type: 'Both', bikespace: '50', carspace: '30', hourrate: '20', operatinghours: '6AM - 11PM', photo: null, covered: true, evcharging: false, verification: true, createdAt: new Date('2025-01-10') },
    { id: 2, parkingname: 'Green Park Parking', ownername: 'Sunita Sharma', email: 'sunita@email.com', mobile: '9765432109', address: '45 Sector 18, Near Metro', city: 'Noida', state: 'UP', map: 'https://maps.google.com/?q=Noida', type: 'Bike', bikespace: '40', carspace: '0', hourrate: '15', operatinghours: '7AM - 10PM', photo: null, covered: false, evcharging: false, verification: true, createdAt: new Date('2025-01-12') },
    { id: 3, parkingname: 'Mall Road Parking', ownername: 'Amit Verma', email: 'amit@email.com', mobile: '9654321098', address: '78 DLF Phase 2, Cyber Hub', city: 'Gurgaon', state: 'Haryana', map: 'https://maps.google.com/?q=Gurgaon', type: 'Car', bikespace: '0', carspace: '40', hourrate: '25', operatinghours: '24 Hours', photo: null, covered: true, evcharging: true, verification: true, createdAt: new Date('2025-01-15') },
    { id: 4, parkingname: 'Vikram Parking Zone', ownername: 'Vikram Nair', email: 'vikram@email.com', mobile: '9543210987', address: '12 Andheri West, Near Station', city: 'Mumbai', state: 'Maharashtra', map: 'https://maps.google.com/?q=Mumbai', type: 'Both', bikespace: '30', carspace: '20', hourrate: '18', operatinghours: '8AM - 9PM', photo: null, covered: false, evcharging: false, verification: false, createdAt: new Date('2025-02-01') },
    { id: 5, parkingname: 'Patel Parking Hub', ownername: 'Meena Patel', email: 'meena@email.com', mobile: '9432109876', address: '56 CG Road, Navrangpura', city: 'Ahmedabad', state: 'Gujarat', map: 'https://maps.google.com/?q=Ahmedabad', type: 'Bike', bikespace: '60', carspace: '0', hourrate: '12', operatinghours: '6AM - 10PM', photo: null, covered: false, evcharging: false, verification: false, createdAt: new Date('2025-02-05') },
  ],

  dailyParkings: [
    { id: 1, parkingId: 1, vehiclenumber: 'UP32AB1234', ownername: 'Rahul Sharma', type: '2W', date: '2025-01-15', intime: '09:30', outtime: '11:45', amount: 50 },
    { id: 2, parkingId: 1, vehiclenumber: 'DL01CA5678', ownername: 'Priya Singh', type: '4W', date: '2025-01-15', intime: '10:15', outtime: '14:30', amount: 120 },
    { id: 3, parkingId: 1, vehiclenumber: 'MH12DE9012', ownername: 'Amit Kumar', type: '2W', date: '2025-01-15', intime: '11:00', outtime: '-', amount: null },
    { id: 4, parkingId: 1, vehiclenumber: 'RJ14GH3456', ownername: 'Sunita Devi', type: '4W', date: '2025-01-14', intime: '08:00', outtime: '10:00', amount: 80 },
    { id: 5, parkingId: 1, vehiclenumber: 'KA05IJ7890', ownername: 'Vikram Nair', type: '2W', date: '2025-01-14', intime: '13:00', outtime: '15:30', amount: 60 },
  ],

  bookings: [
    { id: 1, userId: 1, parkingId: 1, parkingName: 'Central City Parking', location: 'Delhi', type: 'CAR PARKING', date: '2025-01-15', time: '10:00', duration: 3, totalPrice: 60, status: 'completed', rating: 4.5, image: null },
    { id: 2, userId: 1, parkingId: 2, parkingName: 'Green Park Parking', location: 'Noida', type: 'BIKE PARKING', date: '2025-01-16', time: '09:00', duration: 2, totalPrice: 30, status: 'ongoing', rating: 4.2, image: null },
    { id: 3, userId: 1, parkingId: 3, parkingName: 'Mall Road Parking', location: 'Gurgaon', type: 'CAR PARKING', date: '2025-01-10', time: '14:00', duration: 4, totalPrice: 100, status: 'cancelled', rating: 4.8, image: null },
  ],

  contacts: [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', mobile: '9876543210', message: 'Great parking service, very convenient and affordable.', date: new Date('2025-01-15') },
    { id: 2, name: 'Priya Singh', email: 'priya@email.com', mobile: '9765432109', message: 'Need more bike slots near the entrance gate.', date: new Date('2025-01-14') },
    { id: 3, name: 'Amit Kumar', email: 'amit@email.com', mobile: '9654321098', message: 'Staff is very helpful and cooperative. Keep it up!', date: new Date('2025-01-13') },
  ],

  notifications: [
    { id: 1, userId: 1, title: 'Welcome to AuraPark!', message: 'Thanks for joining AuraPark. Start exploring parking spots near you.', type: 'success', read: false, createdAt: new Date('2025-01-01') },
    { id: 2, userId: 1, title: 'Limited Time Offer', message: 'Get 20% off on your first 3 bookings. Use code AURA20.', type: 'promo', read: false, createdAt: new Date('2025-01-02') },
    { id: 3, userId: 1, title: 'New Spots in Your Area', message: '5 new parking spots listed near your location.', type: 'info', read: true, createdAt: new Date('2025-01-03') },
  ],

  // Auto-increment counters
  _counters: { users: 2, admins: 1, parkings: 5, dailyParkings: 5, bookings: 3, contacts: 3, notifications: 3 },

  nextId(table) {
    this._counters[table] = (this._counters[table] || 0) + 1;
    return this._counters[table];
  }
};

module.exports = db;
