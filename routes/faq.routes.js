const router = require('express').Router();
const ctrl = require('../controllers/faq.controller');
const { verifySuperAdmin } = require('../middleware/auth.middleware');

router.get('/', ctrl.getAll);                              // Public
router.get('/admin', verifySuperAdmin, ctrl.getAllAdmin);  // SuperAdmin
router.post('/', verifySuperAdmin, ctrl.create);
router.put('/:id', verifySuperAdmin, ctrl.update);
router.delete('/:id', verifySuperAdmin, ctrl.remove);

module.exports = router;
