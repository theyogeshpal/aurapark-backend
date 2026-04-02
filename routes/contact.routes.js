const router = require('express').Router();
const ctrl = require('../controllers/contact.controller');
const { verifySuperAdmin } = require('../middleware/auth.middleware');

router.post('/', ctrl.submitContact);
router.get('/', verifySuperAdmin, ctrl.getAllContacts);
router.delete('/:id', verifySuperAdmin, ctrl.deleteContact);

module.exports = router;
