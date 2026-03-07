const express = require('express');
const profileController = require('../../controllers/api/profile');

const router = express.Router();

router.get('/profile', profileController.getProfile);
router.put('/profile/info', profileController.editProfile);
router.put('/profile/image', profileController.editProfileImage);
router.put('/profile/changepass', profileController.changePassword);

module.exports = router;