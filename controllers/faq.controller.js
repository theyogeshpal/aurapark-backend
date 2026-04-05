const FAQ = require('../models/FAQ');

exports.getAll = async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    if (!question || !answer) return res.status(400).json({ success: false, message: 'Question and answer required' });
    const faq = await FAQ.create({ question, answer, order: order || 0 });
    res.status(201).json({ success: true, data: faq });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
