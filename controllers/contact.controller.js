const db = require('../db/data');

// Submit contact/feedback (public)
exports.submitContact = (req, res) => {
  const { name, email, mobile, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message are required' });

  const contact = { id: db.nextId('contacts'), name, email, mobile: mobile || '', message, date: new Date() };
  db.contacts.push(contact);
  res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
};

// Get all contacts (superadmin)
exports.getAllContacts = (req, res) => {
  res.json({ success: true, count: db.contacts.length, data: db.contacts });
};

// Delete a contact (superadmin)
exports.deleteContact = (req, res) => {
  const idx = db.contacts.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Contact not found' });
  db.contacts.splice(idx, 1);
  res.json({ success: true, message: 'Contact deleted' });
};
