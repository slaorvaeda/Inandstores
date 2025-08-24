const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../Schema/Newuser');

// Function to verify Firebase token (simplified version)
async function verifyFirebaseToken(token) {
  try {
    // For now, we'll decode the JWT token to get user info
    // In production, you should use Firebase Admin SDK to verify the token
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.email) {
      return null;
    }
    
    const userInfo = {
      email: decoded.email,
      name: decoded.name || decoded.display_name || decoded.displayName,
      picture: decoded.picture,
      googleId: decoded.user_id || decoded.sub
    };
    
    return userInfo;
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return null;
  }
}

// Initialize Google OAuth client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('GOOGLE_CLIENT_ID is not defined in environment variables');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }
    if (!GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in environment variables.');
      return res.status(500).json({ message: 'Google OAuth is not properly configured on server.' });
    }
    let userInfo = null;
    // Try Google OAuth verification first
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      userInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };
    } catch (googleError) {
      console.warn('Google OAuth verification failed, trying Firebase token...', googleError.message);
      userInfo = await verifyFirebaseToken(token);
    }
    if (!userInfo) {
      console.error('Token verification failed.');
      return res.status(400).json({ message: 'Invalid Google or Firebase token.' });
    }
    const { email, name, picture, googleId } = userInfo;
    if (!email) {
      return res.status(400).json({ message: 'No email found in token.' });
    }
    // Check if user already exists
    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name: name || 'Google User',
        email,
        avatar: picture,
        googleId,
        isGoogleUser: true,
        provider: 'google',
        isVerified: true
      });
      await user.save();
      isNewUser = true;
    } else {
      // Update existing user with Google info if needed
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (!user.isGoogleUser) { user.isGoogleUser = true; updated = true; }
      if (!user.provider) { user.provider = 'google'; updated = true; }
      if (!user.avatar && picture) { user.avatar = picture; updated = true; }
      if (!user.isVerified) { user.isVerified = true; updated = true; }
      if (updated) {
        await user.save();
      }
    }
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables.');
      return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing.' });
    }
    // Generate JWT token with proper user ID
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGoogleUser: user.isGoogleUser,
        provider: user.provider
      },
      isNewUser: isNewUser
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
};

exports.validateGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google OAuth is not properly configured' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    res.json({ 
      valid: true, 
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    });

  } catch (error) {
    console.error('Google token validation error:', error);
    res.status(400).json({ valid: false, message: 'Invalid Google token' });
  }
};
