const mongoose = require('mongoose');

const PurchaseItemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item',
    required: false
  },
  itemName: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0.01
  },
  rate: { 
    type: Number, 
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  hsnCode: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true,
    default: 'Nos'
  },
  receivedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'partial', 'cancelled'],
    default: 'pending'
  }
}, { 
  _id: true,
  timestamps: true 
});

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'credit_card', 'upi', 'other'],
    required: true
  },
  reference: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  }
}, {
  _id: true,
  timestamps: true
});

const PurchaseBillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Purchase Bill Details
  billNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  currency: { 
    type: String, 
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  exchangeRate: {
    type: Number,
    default: 1
  },

  // Vendor Information
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },

  // Dates
  billDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dueDate: { 
    type: Date,
    required: false
  },
  expectedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },

  // Business Information
  purchaseOrder: {
    type: String,
    trim: true
  },
  subject: { 
    type: String,
    trim: true,
    maxlength: 200
  },
  project: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },

  // Items
  items: [PurchaseItemSchema],

  // Financial Calculations
  subTotal: { 
    type: Number, 
    required: true,
    min: 0
  },
  discount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  cgstAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  sgstAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  igstAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  tds: { 
    type: Number, 
    default: 0,
    min: 0
  },
  tcs: { 
    type: Number, 
    default: 0,
    min: 0
  },
  freightCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  handlingCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  roundOff: { 
    type: Number, 
    default: 0
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  amountInWords: {
    type: String,
    trim: true
  },

  // Shipping Information
  shippingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' }
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  courierName: {
    type: String,
    trim: true
  },

  // Payment Information
  paymentTerms: {
    type: String,
    enum: ['immediate', 'net_15', 'net_30', 'net_60', 'net_90'],
    default: 'net_30'
  },
  advanceAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  advancePaid: {
    type: Boolean,
    default: false
  },
  advancePaymentDate: {
    type: Date
  },

  // Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'received', 'partially_received', 'cancelled', 'returned'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'overdue'],
    default: 'unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'in_transit', 'received', 'returned'],
    default: 'pending'
  },

  // Quality Control
  qualityCheck: {
    required: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    passed: { type: Boolean },
    notes: String,
    checkedBy: String,
    checkedAt: Date
  },

  // Additional Information
  vendorNotes: { 
    type: String,
    trim: true,
    maxlength: 1000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Attachments
  attachments: [{
    filename: { 
      type: String, 
      required: true 
    },
    url: { 
      type: String, 
      required: true 
    },
    size: { 
      type: Number 
    },
    type: { 
      type: String 
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Payments
  payments: [PaymentSchema],
  totalPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceDue: {
    type: Number,
    default: 0,
    min: 0
  },

  // History & Tracking
  statusHistory: [{
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String },
    notes: { type: String }
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
  },
  receivedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
PurchaseBillSchema.index({ userId: 1, status: 1 });
PurchaseBillSchema.index({ userId: 1, vendor: 1 });
PurchaseBillSchema.index({ userId: 1, billDate: -1 });
PurchaseBillSchema.index({ userId: 1, dueDate: 1 });
PurchaseBillSchema.index({ 'items.status': 1 });

// Compound index for user-specific bill numbers (unique)
PurchaseBillSchema.index({ userId: 1, billNumber: 1 }, { unique: true });

// Pre-save middleware
PurchaseBillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate balance due
  this.balanceDue = this.totalAmount - this.totalPaid;
  
  // Update payment status
  if (this.balanceDue <= 0) {
    this.paymentStatus = 'paid';
    if (!this.paidAt) this.paidAt = new Date();
  } else if (this.totalPaid > 0) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'unpaid';
  }
  
  // Check if overdue
  if (this.dueDate && this.dueDate < new Date() && this.paymentStatus !== 'paid') {
    this.paymentStatus = 'overdue';
  }
  
  // Update delivery status based on items
  const allReceived = this.items.every(item => item.status === 'received');
  const anyReceived = this.items.some(item => item.status === 'received');
  
  if (allReceived) {
    this.deliveryStatus = 'received';
    this.status = 'received';
    if (!this.receivedAt) this.receivedAt = new Date();
  } else if (anyReceived) {
    this.deliveryStatus = 'received';
    this.status = 'partially_received';
  }
  
  next();
});

// Virtual for full shipping address
PurchaseBillSchema.virtual('fullShippingAddress').get(function() {
  const addr = this.shippingAddress;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Method to calculate total tax
PurchaseBillSchema.methods.calculateTotalTax = function() {
  return this.cgstAmount + this.sgstAmount + this.igstAmount;
};

// Method to check if bill is overdue
PurchaseBillSchema.methods.isOverdue = function() {
  return this.dueDate && this.dueDate < new Date() && this.paymentStatus !== 'paid';
};

// Method to calculate days overdue
PurchaseBillSchema.methods.getDaysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Method to update bill status
PurchaseBillSchema.methods.updateStatus = function(newStatus, notes = '', changedBy = '') {
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy,
    notes
  });
  this.status = newStatus;
  return this.save();
};

// Static method to get overdue bills
PurchaseBillSchema.statics.getOverdueBills = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    paymentStatus: { $ne: 'paid' }
  });
};

// Static method to get bills by status
PurchaseBillSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status });
};

// Static method to get bills by vendor
PurchaseBillSchema.statics.getByVendor = function(userId, vendorId) {
  return this.find({ userId, vendor: vendorId });
};

module.exports = mongoose.model('PurchaseBill', PurchaseBillSchema);
