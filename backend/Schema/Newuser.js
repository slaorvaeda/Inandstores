const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  // Authentication & Profile
  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 255,
    trim: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    minlength: 6,
    select: false, 
  },
  avatar: {
    type: String,
    default: "",
  },

  // Google-specific fields
  googleId: {
    type: String,
    // sparse: true, // Allows multiple null values (handled by schema.index below)
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },

  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },

  // User Preferences
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  dateFormat: {
    type: String,
    default: 'DD/MM/YYYY',
    enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa']
  },



  // User Management
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },

  // Preferences
  preferences: {
    emailNotifications: {
      enabled: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    theme: { type: String, default: 'light', enum: ['light', 'dark', 'auto'] }
  }
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ status: 1 });

// password hashing - only for local users
userSchema.pre("save", async function (next) {
  if (this.provider !== "local" || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//password comparison 
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});



const Newuser = mongoose.model("User", userSchema);
module.exports = Newuser;
