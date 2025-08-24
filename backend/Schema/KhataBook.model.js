const mongoose = require('mongoose');

const KhataBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Ledger Type - Client or Vendor
  ledgerType: {
    type: String,
    enum: ['client', 'vendor'],
    required: true
  },
  
  // Reference to Client or Vendor model (optional for standalone khatas)
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  
  // Basic Information (can be populated from Client/Vendor models)
  personName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  phone: {
    type: String,
    trim: true,
    maxlength: 15
  },
  
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Ledger Summary
  totalCredit: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalDebit: {
    type: Number,
    default: 0,
    min: 0
  },
  
  currentBalance: {
    type: Number,
    default: 0
  },
  
  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  
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

// Indexes
KhataBookSchema.index({ userId: 1, personName: 1 });
KhataBookSchema.index({ userId: 1, phone: 1 });
KhataBookSchema.index({ userId: 1, status: 1 });
KhataBookSchema.index({ userId: 1, ledgerType: 1 });
KhataBookSchema.index({ clientId: 1 });
KhataBookSchema.index({ vendorId: 1 });

// Pre-save middleware to update updatedAt
KhataBookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to calculate current balance
KhataBookSchema.methods.calculateBalance = function() {
  this.currentBalance = this.totalCredit - this.totalDebit;
  return this.currentBalance;
};

// Method to add credit entry
KhataBookSchema.methods.addCredit = function(amount) {
  this.totalCredit += amount;
  this.calculateBalance();
  return this.save();
};

// Method to add debit entry
KhataBookSchema.methods.addDebit = function(amount) {
  this.totalDebit += amount;
  this.calculateBalance();
  return this.save();
};

// Static method to get all khatas for a user
KhataBookSchema.statics.getByUser = function(userId) {
  return this.find({ userId }).sort({ updatedAt: -1 });
};

// Static method to get active khatas
KhataBookSchema.statics.getActiveKhatas = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ updatedAt: -1 });
};

// Static method to search khatas
KhataBookSchema.statics.searchKhatas = function(userId, searchTerm) {
  return this.find({
    userId,
    $or: [
      { personName: { $regex: searchTerm, $options: 'i' } },
      { phone: { $regex: searchTerm, $options: 'i' } },
      { address: { $regex: searchTerm, $options: 'i' } }
    ]
  }).sort({ updatedAt: -1 });
};

// Static method to get client khatas
KhataBookSchema.statics.getClientKhatas = function(userId) {
  return this.find({ userId, ledgerType: 'client' })
    .populate('clientId', 'name phone email address')
    .sort({ updatedAt: -1 });
};

// Static method to get vendor khatas
KhataBookSchema.statics.getVendorKhatas = function(userId) {
  return this.find({ userId, ledgerType: 'vendor' })
    .populate('vendorId', 'name company phone email address')
    .sort({ updatedAt: -1 });
};

// Static method to get khatas by type
KhataBookSchema.statics.getKhatasByType = function(userId, ledgerType) {
  if (ledgerType === 'client') {
    return this.getClientKhatas(userId);
  } else if (ledgerType === 'vendor') {
    return this.getVendorKhatas(userId);
  }
  return this.getByUser(userId);
};

module.exports = mongoose.model('KhataBook', KhataBookSchema);
