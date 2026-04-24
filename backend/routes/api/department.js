const express = require('express');
const departmentController = require('../../controllers/api/department');
const { requireAuth, requireBothAdmin } = require('../../middleware/auth');

const router = express.Router();

router.get('/departments', requireAuth, departmentController.getAllDepartments);
router.post('/department', requireBothAdmin, departmentController.createDepartment);
router.put('/department/:id', requireBothAdmin, departmentController.updateDepartment);
router.delete('/department/:id', requireBothAdmin, departmentController.deleteDepartment);

module.exports = router;
