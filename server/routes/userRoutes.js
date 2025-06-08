const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// User routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/user/:userId', authMiddleware.verifyToken, userController.getUserById);
router.put('/user/:userId', authMiddleware.verifyToken, userController.editProfile);
router.post('/send-otp', userController.sendOtp);
router.post('/forgotpassword', userController.resetPassword);

module.exports = router;