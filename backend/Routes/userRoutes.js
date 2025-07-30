const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

// Get current user profile
router.get('/profile', verifyToken, getUserProfile);

// Update current user profile
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;