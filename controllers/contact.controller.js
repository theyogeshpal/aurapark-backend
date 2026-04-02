const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    await Contact.create({ name, email, mobile: mobile || '', message });
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
