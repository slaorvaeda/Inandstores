const mongoose = require('mongoose');

const KhataEntrySchema = new mongoose.Schema({
  khataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhataBook',
    required: true,
    index: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Entry Details
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Date of transaction
  transactionDate: {
    type: Date,
    default: Date.now
  },
  
  // Balance after this entry
  balanceAfter: {
    type: Number,
    required: true
  },
  
  // Notes for this entry
  notes: {
    type: String,
    trim: true,
    maxlength: 300
  },
  
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: {
    type: Date,
    default: null
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Indexes
KhataEntrySchema.index({ khataId: 1, createdAt: -1 });
KhataEntrySchema.index({ userId: 1, transactionDate: -1 });
KhataEntrySchema.index({ type: 1, transactionDate: -1 });

// Pre-save middleware
KhataEntrySchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
});

// Static method to get entries for a khata
KhataEntrySchema.statics.getByKhata = function(khataId) {
  return this.find({ khataId }).sort({ createdAt: -1 });
};

// Static method to get recent entries for a user
KhataEntrySchema.statics.getRecentEntries = function(userId, limit = 10) {
  return this.find({ userId })
    .populate('khataId', 'personName')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get entries by date range
KhataEntrySchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    transactionDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('khataId', 'personName').sort({ transactionDate: -1 });
};

module.exports = mongoose.model('KhataEntry', KhataEntrySchema);
