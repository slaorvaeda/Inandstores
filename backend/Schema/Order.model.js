const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
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
  deliveredQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { 
  _id: true,
  timestamps: true 
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Order Details
  orderNumber: { 
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

  // Client Information
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },

  // Dates
  orderDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  expectedDeliveryDate: { 
    type: Date,
    required: true
  },
  actualDeliveryDate: {
    type: Date
  },
  productionStartDate: {
    type: Date
  },
  productionEndDate: {
    type: Date
  },

  // Business Information
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
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Items
  items: [OrderItemSchema],

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
  shippingCharges: {
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
    enum: ['advance', 'cod', 'net_30', 'net_60', 'net_90'],
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
    enum: ['draft', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'overdue'],
    default: 'unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'returned'],
    default: 'pending'
  },

  // Production & Manufacturing
  productionDetails: {
    startDate: Date,
    endDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    notes: String
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
  customerNotes: { 
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
  confirmedAt: Date,
  productionStartedAt: Date,
  productionCompletedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ userId: 1, client: 1 });
OrderSchema.index({ userId: 1, orderDate: -1 });
OrderSchema.index({ userId: 1, expectedDeliveryDate: 1 });
OrderSchema.index({ 'items.status': 1 });

// Compound index for user-specific order numbers (unique)
OrderSchema.index({ userId: 1, orderNumber: 1 }, { unique: true });

// Pre-save middleware
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update delivery status based on items
  const allDelivered = this.items.every(item => item.status === 'delivered');
  const allShipped = this.items.every(item => item.status === 'shipped');
  const anyShipped = this.items.some(item => item.status === 'shipped');
  
  if (allDelivered) {
    this.deliveryStatus = 'delivered';
    this.status = 'delivered';
    if (!this.deliveredAt) this.deliveredAt = new Date();
  } else if (allShipped) {
    this.deliveryStatus = 'in_transit';
    this.status = 'shipped';
    if (!this.shippedAt) this.shippedAt = new Date();
  } else if (anyShipped) {
    this.deliveryStatus = 'in_transit';
  }
  
  // Update payment status
  if (this.advancePaid && this.advanceAmount >= this.totalAmount) {
    this.paymentStatus = 'paid';
  } else if (this.advancePaid && this.advanceAmount > 0) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'unpaid';
  }
  
  next();
});

// Virtual for full shipping address
OrderSchema.virtual('fullShippingAddress').get(function() {
  const addr = this.shippingAddress;
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Method to calculate total tax
OrderSchema.methods.calculateTotalTax = function() {
  return this.cgstAmount + this.sgstAmount + this.igstAmount;
};

// Method to check if order is overdue
OrderSchema.methods.isOverdue = function() {
  return this.expectedDeliveryDate && this.expectedDeliveryDate < new Date() && this.status !== 'delivered';
};

// Method to calculate days overdue
OrderSchema.methods.getDaysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const dueDate = new Date(this.expectedDeliveryDate);
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Method to update order status
OrderSchema.methods.updateStatus = function(newStatus, notes = '', changedBy = '') {
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy,
    notes
  });
  this.status = newStatus;
  return this.save();
};

// Static method to get overdue orders
OrderSchema.statics.getOverdueOrders = function(userId) {
  return this.find({
    userId,
    expectedDeliveryDate: { $lt: new Date() },
    status: { $nin: ['delivered', 'cancelled'] }
  });
};

// Static method to get orders by status
OrderSchema.statics.getByStatus = function(userId, status) {
  return this.find({ userId, status });
};

// Static method to get orders by client
OrderSchema.statics.getByClient = function(userId, clientId) {
  return this.find({ userId, client: clientId });
};

module.exports = mongoose.model('Order', OrderSchema);
