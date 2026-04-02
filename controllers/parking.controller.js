const db = require('../db/data');

// ─── PUBLIC ─────────────────────────────────────────────
exports.getAllVerified = (req, res) => {
  const { city, type, q } = req.query;
  let result = db.parkings.filter(p => p.verification);
  if (city) result = result.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (type) result = result.filter(p => p.type === type || p.type === 'Both');
  if (q) result = result.filter(p => p.parkingname.toLowerCase().includes(q.toLowerCase()) || p.city.toLowerCase().includes(q.toLowerCase()));
  res.json({ success: true, count: result.length, data: result });
};

exports.getById = (req, res) => {
  const parking = db.parkings.find(p => p.id === parseInt(req.params.id));
  if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });
  res.json({ success: true, data: parking });
};

// ─── PUBLIC — Add new parking request (from website) ────
exports.addParkingRequest = (req, res) => {
  const { name, email, mobile, parkingName, address, city, state, map, type, carSpace, bikeSpace, hourRate, operatingHours, covered, evCharging } = req.body;
  if (!name || !email || !mobile || !address || !city || !state || !map || !hourRate || !operatingHours)
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });

  const parking = {
    id: db.nextId('parkings'),
    parkingname: parkingName || `${name}'s Parking`,
    ownername: name, email, mobile, address, city, state, map,
    type: type || 'Both',
    bikespace: bikeSpace || '0',
    carspace: carSpace || '0',
    hourrate: hourRate,
    operatinghours: operatingHours,
    photo: null,
    covered: covered || false,
    evcharging: evCharging || false,
    verification: false,
    createdAt: new Date()
  };
  db.parkings.push(parking);
  res.status(201).json({ success: true, message: 'Parking request submitted for review', data: parking });
};

// ─── ADMIN ───────────────────────────────────────────────
exports.getAdminParking = (req, res) => {
  const parking = db.parkings.find(p => p.id === req.user.parkingId);
  if (!parking) return res.status(404).json({ success: false, message: 'Parking not found' });
  res.json({ success: true, data: parking });
};

exports.updateAdminParking = (req, res) => {
  const idx = db.parkings.findIndex(p => p.id === req.user.parkingId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Parking not found' });
  const allowed = ['parkingname', 'hourrate', 'operatinghours', 'address', 'city', 'state', 'map', 'bikespace', 'carspace', 'covered', 'evcharging'];
  allowed.forEach(key => { if (req.body[key] !== undefined) db.parkings[idx][key] = req.body[key]; });
  res.json({ success: true, message: 'Parking updated', data: db.parkings[idx] });
};

// ─── SUPERADMIN ──────────────────────────────────────────
exports.getAllParkings = (req, res) => {
  res.json({ success: true, count: db.parkings.length, data: db.parkings });
};

exports.getPendingParkings = (req, res) => {
  const pending = db.parkings.filter(p => !p.verification);
  res.json({ success: true, count: pending.length, data: pending });
};

exports.verifyParking = (req, res) => {
  const idx = db.parkings.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Parking not found' });
  db.parkings[idx].verification = true;
  res.json({ success: true, message: 'Parking verified successfully', data: db.parkings[idx] });
};

exports.deleteParking = (req, res) => {
  const idx = db.parkings.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Parking not found' });
  db.parkings.splice(idx, 1);
  res.json({ success: true, message: 'Parking deleted successfully' });
};
