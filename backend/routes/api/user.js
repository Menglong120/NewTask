const express = require('express');
const userController = require('../../controllers/api/user');
const { requireAuth, requireAdmin, requireBothAdmin } = require('../../middleware/auth');
const { checkUser, checkUserRole } = require('../../middleware/user');

const router = express.Router();

router.get('/users', requireBothAdmin, checkUserRole, userController.getAllUsers);
router.get('/user/:id', requireBothAdmin, checkUser, userController.getUser);
router.delete('/user/:id', requireBothAdmin, checkUser, userController.deleteUser);
router.put('/user/:id', requireBothAdmin, checkUser, userController.changeRole);
router.put('/user/pass/:id', requireAdmin, checkUser, userController.changeUserPassword);

// User role
router.post('/role', requireAdmin, userController.createRole);
router.get('/roles', requireAuth, userController.getAllRoles);
router.put('/role/:id', requireAdmin, userController.editRole);
router.delete('/role/:id', requireAdmin, userController.deleteRole);

// User Requests
router.get('/request/password', requireAdmin, userController.getAllRequest);
router.post('/request/password', requireAuth, userController.sendRequest);
router.put('/request/password/:id', requireAdmin, userController.updateRequest);

module.exports = router;