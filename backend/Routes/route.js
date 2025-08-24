const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Schema/Newuser");
const router = express.Router();
const dotenv = require("dotenv");
const invoiceController = require('../controllers/invoiceController');
const Invoice = require('../Schema/Invoice.model');
const verifyToken = require("../middleware/auth"); // Middleware to verify JWT

dotenv.config();

// Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

// Welcome route
router.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // ✅ Let schema hash password and set provider
    const newUser = new User({ 
      name, 
      email, 
      password, 
      avatar,
      provider: 'local'
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is a Google user trying to login with password
    if (user.provider === 'google' && !user.password) {
      return res.status(401).json({ message: "This account was created with Google. Please use Google Sign-In." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider || 'local'
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Get user avatar
router.get("/avatar/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      avatar: user.avatar || "https://via.placeholder.com/40", // Default avatar if not set
      name: user.name || "User", // Default name if not set
    });
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post('/invoices', verifyToken, invoiceController.createInvoice);

// Get next invoice number
router.get('/invoices/next-number', verifyToken, invoiceController.getNextInvoiceNumber);



// Get all invoices - this must come BEFORE /invoices/:id
router.get('/invoices', verifyToken, invoiceController.getAllInvoices);

router.get('/invoices/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client'); // Replace with your DB query
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/invoices/:id', verifyToken, async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updatedInvoice);
  } catch (err) {
    console.error('Error updating invoice:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/invoices/:id', verifyToken, async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/user/update/:id', async (req, res) => {
  try {
    const { name, password, avatar } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      name: user.name,
      avatar: user.avatar,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
