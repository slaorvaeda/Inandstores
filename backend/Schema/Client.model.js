const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Basic Information
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200
  },
  company: {
    type: String,
    trim: true,
    maxlength: 200
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Contact Information
  contact: {
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      validate: {
        validator: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
    phone: { 
      type: String, 
      trim: true 
    },
    mobile: { 
      type: String, 
      trim: true 
    },
    website: { 
      type: String, 
      trim: true 
    }
  },

  // Address Information
  billingAddress: {
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
  gstTreatment: {
    type: String,
    enum: ['Unregistered Business', 'Registered Business', 'Consumer', 'Overseas'],
    default: 'Unregistered Business'
  },
  placeOfSupply: { 
    type: String, 
    trim: true 
  },

  // Business Information
  industry: {
    type: String,
    trim: true,
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
      'Real Estate', 'Transportation', 'Food & Beverage', 'Entertainment',
      'Consulting', 'Legal', 'Other'
    ]
  },
  source: {
    type: String,
    trim: true,
    enum: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other']
  },

  // Financial Information
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentTerms: {
    type: Number,
    default: 30, // days
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },

  // Status & Classification
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'lead'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Notes & Additional Information
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Statistics
  stats: {
    totalInvoices: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 },
    lastInvoiceDate: { type: Date },
    lastPaymentDate: { type: Date }
  },

  // Custom Fields (for flexibility)
  customFields: [{
    name: { type: String, required: true },
    value: { type: String },
    type: { 
      type: String, 
      enum: ['text', 'number', 'date', 'boolean'],
      default: 'text'
    }
  }],

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
ClientSchema.index({ userId: 1, status: 1 });
ClientSchema.index({ userId: 1, name: 1 });
ClientSchema.index({ 'contact.email': 1 });
ClientSchema.index({ gstNumber: 1 });

// Pre-save middleware to update updatedAt
ClientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full billing address
ClientSchema.virtual('fullBillingAddress').get(function() {
  const addr = this.billingAddress;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Virtual for full shipping address
ClientSchema.virtual('fullShippingAddress').get(function() {
  const addr = this.shippingAddress;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Method to calculate outstanding amount
ClientSchema.methods.calculateOutstanding = function() {
  return this.stats.totalAmount - this.stats.paidAmount;
};

// Method to check if client is active
ClientSchema.methods.isActive = function() {
  return this.status === 'active';
};

// Static method to get clients by status
ClientSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status });
};

module.exports = mongoose.model('Client', ClientSchema);
