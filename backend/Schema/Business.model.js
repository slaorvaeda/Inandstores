const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  // Business Owner (User Reference)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Basic Business Information
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  businessType: {
    type: String,
    enum: ['Individual', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Sole Proprietorship'],
    default: 'Individual'
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Tax Information
  gstNumber: {
    type: String,
    trim: true,
    validate: {
      validator: v => !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v),
      message: 'Invalid GST number format'
    }
  },
  panNumber: {
    type: String,
    trim: true,
    validate: {
      validator: v => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
      message: 'Invalid PAN number format'
    }
  },
  tdsSection: {
    type: String,
    trim: true
  },
  tdsRate: {
    type: Number,
    min: 0,
    max: 100
  },

  // Business Address
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },
  shippingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },

  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  website: {
    type: String,
    trim: true
  },

  // Bank Details
  bankDetails: {
    accountNumber: { type: String, trim: true },
    ifsc: { type: String, trim: true },
    bankName: { type: String, trim: true },
    branch: { type: String, trim: true },
    upiId: { type: String, trim: true }
  },

  // Business Settings
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
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

  // Business Preferences
  preferences: {
    defaultTaxRate: { type: Number, default: 18 },
    autoNumbering: { type: Boolean, default: true },
    paymentTerms: { type: Number, default: 30 }, // days
    invoiceTemplate: { type: String, default: 'default' },
    emailNotifications: {
      invoiceCreated: { type: Boolean, default: true },
      invoicePaid: { type: Boolean, default: true },
      paymentReminder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true }
    }
  },

  // Business Statistics
  stats: {
    totalInvoices: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
    totalVendors: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
    lastInvoiceDate: { type: Date }
  },

  // Business Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Documents & Attachments
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Custom Fields
  customFields: [{
    name: { 
      type: String, 
      required: true 
    },
    value: { 
      type: String 
    },
    type: { 
      type: String, 
      enum: ['text', 'number', 'date', 'boolean'],
      default: 'text'
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
businessSchema.index({ userId: 1 });
businessSchema.index({ businessName: 1 });
businessSchema.index({ gstNumber: 1 });
businessSchema.index({ status: 1 });

// Pre-save middleware
businessSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full address
businessSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Virtual for full shipping address
businessSchema.virtual('fullShippingAddress').get(function() {
  const addr = this.shippingAddress;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Method to check if business is active
businessSchema.methods.isActive = function() {
  return this.status === 'active';
};

// Method to check if business is verified
businessSchema.methods.isVerified = function() {
  return this.isVerified;
};

// Static method to get active businesses
businessSchema.statics.getActiveBusinesses = function() {
  return this.find({ status: 'active' });
};

// Static method to get business by user
businessSchema.statics.getByUser = function(userId) {
  return this.findOne({ userId, status: 'active' });
};

module.exports = mongoose.model('Business', businessSchema);
