const express = require('express');
const authController = require('../../controllers/api/auth');
const { requireBothAdmin } = require('../../middleware/auth');

const router = express.Router();

router.post('/register', requireBothAdmin, authController.register);
router.post('/login', authController.login);
router.post('/superadmin/login', authController.loginSuperAdmin);
router.delete('/logout', authController.logout);


module.exports = router;