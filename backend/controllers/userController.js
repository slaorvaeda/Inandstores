const User = require('../Schema/Newuser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const {
      name, avatar, password, phone,
      businessName, businessType, gstNumber, panNumber,
      address, bankDetails,
      currency, timezone, dateFormat, language
    } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update personal information
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update business information
    if (businessName) user.businessName = businessName;
    if (businessType) user.businessType = businessType;
    if (gstNumber) user.gstNumber = gstNumber.toUpperCase();
    if (panNumber) user.panNumber = panNumber.toUpperCase();

    // Update address
    if (address) {
      user.address = { ...(user.address || {}), ...address };
    }

    // Update bank details
    if (bankDetails) {
      user.bankDetails = { ...(user.bankDetails || {}), ...bankDetails };
    }

    // Update business settings
    if (currency) user.currency = currency;
    if (timezone) user.timezone = timezone;
    if (dateFormat) user.dateFormat = dateFormat;
    if (language) user.language = language;
    
    await user.save();

    // Return updated user data (excluding password)
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message
    });
  }
};

// Normal user login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email, provider: 'local' }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfiguration: JWT secret missing.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGoogleUser: user.isGoogleUser,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};