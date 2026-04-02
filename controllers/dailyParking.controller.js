const db = require('../db/data');

// Get all active (currently parked) vehicles for admin's parking
exports.getActive = (req, res) => {
  const active = db.dailyParkings.filter(d => d.parkingId === req.user.parkingId && d.outtime === '-');
  res.json({ success: true, count: active.length, data: active });
};

// Get full history for admin's parking
exports.getHistory = (req, res) => {
  const history = db.dailyParkings.filter(d => d.parkingId === req.user.parkingId);
  res.json({ success: true, count: history.length, data: history });
};

// Park a new vehicle (entry)
exports.parkVehicle = (req, res) => {
  const { vehiclenumber, ownername, type } = req.body;
  if (!vehiclenumber || !ownername || !type) return res.status(400).json({ success: false, message: 'Vehicle number, owner name and type required' });

  // Check if already parked
  const alreadyParked = db.dailyParkings.find(d => d.vehiclenumber.toUpperCase() === vehiclenumber.toUpperCase() && d.outtime === '-');
  if (alreadyParked) return res.status(409).json({ success: false, message: 'Vehicle is already parked' });

  const now = new Date();
  const entry = {
    id: db.nextId('dailyParkings'),
    parkingId: req.user.parkingId,
    vehiclenumber: vehiclenumber.toUpperCase(),
    ownername,
    type,
    date: now.toISOString().split('T')[0],
    intime: now.toTimeString().substring(0, 5),
    outtime: '-',
    amount: null
  };
  db.dailyParkings.push(entry);
  res.status(201).json({ success: true, message: `Vehicle ${entry.vehiclenumber} parked successfully`, data: entry });
};

// Exit vehicle (checkout)
exports.exitVehicle = (req, res) => {
  const idx = db.dailyParkings.findIndex(d => d.id === parseInt(req.params.id) && d.parkingId === req.user.parkingId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Record not found' });
  if (db.dailyParkings[idx].outtime !== '-') return res.status(400).json({ success: false, message: 'Vehicle already checked out' });

  const parking = db.parkings.find(p => p.id === req.user.parkingId);
  const now = new Date();
  const outtime = now.toTimeString().substring(0, 5);

  // Calculate amount
  const [inH, inM] = db.dailyParkings[idx].intime.split(':').map(Number);
  const [outH, outM] = outtime.split(':').map(Number);
  const hours = Math.max(1, Math.ceil(((outH * 60 + outM) - (inH * 60 + inM)) / 60));
  const amount = hours * parseInt(parking?.hourrate || 20);

  db.dailyParkings[idx].outtime = outtime;
  db.dailyParkings[idx].amount = amount;
  res.json({ success: true, message: 'Vehicle checked out', data: db.dailyParkings[idx] });
};

// Delete a history record
exports.deleteRecord = (req, res) => {
  const idx = db.dailyParkings.findIndex(d => d.id === parseInt(req.params.id) && d.parkingId === req.user.parkingId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Record not found' });
  db.dailyParkings.splice(idx, 1);
  res.json({ success: true, message: 'Record deleted' });
};

// Get receipt/bill for a record
exports.getReceipt = (req, res) => {
  const record = db.dailyParkings.find(d => d.id === parseInt(req.params.id) && d.parkingId === req.user.parkingId);
  if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
  const parking = db.parkings.find(p => p.id === req.user.parkingId);
  res.json({ success: true, data: { ...record, parkingName: parking?.parkingname, parkingAddress: parking?.address } });
};
