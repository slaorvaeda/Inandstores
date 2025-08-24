const express = require('express');
const router = express.Router();
const { googleLogin, validateGoogleToken } = require('../controllers/googleAuthController');

// Google login route
router.post('/login', googleLogin);

// Google token validation route
router.post('/validate', validateGoogleToken);

module.exports = router;
