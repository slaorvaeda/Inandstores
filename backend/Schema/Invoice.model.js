const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item',
    required: true
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
  taxRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  amount: { 
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
  hsnCode: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true,
    default: 'Nos'
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

const InvoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Invoice Details
  invoiceNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  orderNumber: { 
    type: String,
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

  // Client Information
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },

  // Dates
  invoiceDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dueDate: { 
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },

  // Business Information
  terms: { 
    type: String,
    trim: true
  },
  salesperson: { 
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

  // Items
  items: [InvoiceItemSchema],

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

  // Bank Details
  bankDetails: {
    accountNumber: { 
      type: String, 
      trim: true 
    },
    ifsc: { 
      type: String, 
      trim: true 
    },
    bankName: { 
      type: String, 
      trim: true 
    },
    branch: { 
      type: String, 
      trim: true 
    },
    upiId: {
      type: String,
      trim: true
    }
  },

  // Additional Information
  customerNotes: { 
    type: String,
    trim: true,
    maxlength: 1000
  },
  termsAndConditions: { 
    type: String,
    trim: true,
    maxlength: 2000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 1000
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

  // Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'overdue'],
    default: 'unpaid'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextInvoiceDate: Date,
    endDate: Date,
    totalCycles: Number,
    currentCycle: {
      type: Number,
      default: 1
    }
  },

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

  // Email & Communication
  emailHistory: [{
    sentAt: {
      type: Date,
      default: Date.now
    },
    to: [String],
    subject: String,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'opened', 'failed']
    }
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
  sentAt: Date,
  viewedAt: Date,
  paidAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, client: 1 });
InvoiceSchema.index({ userId: 1, invoiceDate: -1 });
InvoiceSchema.index({ userId: 1, dueDate: 1 });
InvoiceSchema.index({ 'payments.status': 1 });

// Compound index for user-specific invoice numbers (unique)
InvoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });

// Pre-save middleware
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate balance due
  this.balanceDue = this.totalAmount - this.totalPaid;
  
  // Update payment status
  if (this.balanceDue <= 0) {
    this.paymentStatus = 'paid';
    this.status = 'paid';
    if (!this.paidAt) this.paidAt = new Date();
  } else if (this.totalPaid > 0) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'unpaid';
  }
  
  // Check if overdue
  if (this.dueDate && this.dueDate < new Date() && this.paymentStatus !== 'paid') {
    this.status = 'overdue';
    this.paymentStatus = 'overdue';
  }
  
  next();
});

// Virtual for full address
InvoiceSchema.virtual('fullAddress').get(function() {
  // This would be populated from client data
  return '';
});

// Method to calculate total tax
InvoiceSchema.methods.calculateTotalTax = function() {
  return this.cgstAmount + this.sgstAmount + this.igstAmount;
};

// Method to check if invoice is overdue
InvoiceSchema.methods.isOverdue = function() {
  return this.dueDate && this.dueDate < new Date() && this.paymentStatus !== 'paid';
};

// Method to calculate days overdue
InvoiceSchema.methods.getDaysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Static method to get overdue invoices
InvoiceSchema.statics.getOverdueInvoices = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    paymentStatus: { $ne: 'paid' }
  });
};

// Static method to get invoices by status
InvoiceSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status });
};

module.exports = mongoose.model('Invoice', InvoiceSchema);
