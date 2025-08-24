const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
  sku: { 
    type: String,
    trim: true,
    maxlength: 50
  },
  barcode: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  brand: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Units & Measurements
  unit: { 
    type: String,
    trim: true,
    default: 'Nos',
    enum: ['Nos', 'Kg', 'Ltr', 'Mtr', 'Sq Ft', 'Hour', 'Day', 'Month', 'Year', 'Piece', 'Set', 'Box', 'Pack']
  },
  weight: {
    type: Number,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'oz'],
    default: 'kg'
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { 
      type: String, 
      enum: ['cm', 'm', 'inch', 'ft'],
      default: 'cm'
    }
  },

  // Tax Information
  hsnCode: { 
    type: String,
    trim: true,
    maxlength: 20
  },
  sacCode: {
    type: String,
    trim: true,
    maxlength: 20
  },
  taxPreference: { 
    type: String, 
    enum: ['Taxable', 'Non-Taxable', 'Zero Rated', 'Exempt'], 
    default: 'Taxable' 
  },
  taxRates: {
    cgst: { type: Number, default: 9, min: 0, max: 100 },
    sgst: { type: Number, default: 9, min: 0, max: 100 },
    igst: { type: Number, default: 18, min: 0, max: 100 }
  },

  // Pricing Information
  costPrice: { 
    type: Number,
    min: 0,
    default: 0
  },
  sellingPrice: { 
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },

  // Stock Management
  stockQuantity: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  reorderLevel: { 
    type: Number, 
    default: 10,
    min: 0
  },
  reorderQuantity: { 
    type: Number, 
    default: 50,
    min: 1
  },
  maxStock: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },

  // Sales Information
  salesInfo: {
    account: { 
      type: String,
      trim: true,
      default: 'Sales'
    },
    description: { 
      type: String,
      trim: true
    },
    intraTaxRate: { 
      type: String,
      trim: true
    },
    interTaxRate: { 
      type: String,
      trim: true
    },
    commission: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Purchase Information
  purchaseInfo: {
    account: { 
      type: String,
      trim: true,
      default: 'Purchase'
    },
    description: { 
      type: String,
      trim: true
    },
    preferredVendor: { 
      type: String,
      trim: true
    },
    leadTime: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Images & Media
  images: [{ 
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String },
    size: { type: Number }
  }],

  // Status & Classification
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  isService: {
    type: Boolean,
    default: false
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],

  // SEO & Marketing
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  keywords: [{
    type: String,
    trim: true
  }],

  // Statistics
  stats: {
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastSoldDate: { type: Date },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  },

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
      enum: ['text', 'number', 'date', 'boolean', 'select'],
      default: 'text'
    },
    options: [{ type: String }] // For select type
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
itemSchema.index({ userId: 1, status: 1 });
itemSchema.index({ userId: 1, name: 1 });
itemSchema.index({ userId: 1, category: 1 });
itemSchema.index({ 'stockQuantity': 1 });
itemSchema.index({ 'hsnCode': 1 });

// Compound index for user-specific SKU (unique)
itemSchema.index({ userId: 1, sku: 1 }, { unique: true, sparse: true });

// Pre-save middleware
itemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set primary image if none exists
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  
  next();
});

// Virtual for primary image
itemSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for stock status
itemSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity <= 0) return 'out_of_stock';
  if (this.stockQuantity <= this.reorderLevel) return 'low_stock';
  return 'in_stock';
});

// Method to check if item is in stock
itemSchema.methods.isInStock = function() {
  return this.stockQuantity > 0;
};

// Method to check if item needs reorder
itemSchema.methods.needsReorder = function() {
  return this.stockQuantity <= this.reorderLevel;
};

// Method to update stock
itemSchema.methods.updateStock = function(quantity, type = 'sale') {
  if (type === 'sale') {
    this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
    this.stats.totalSold += quantity;
    this.stats.lastSoldDate = new Date();
  } else if (type === 'purchase') {
    this.stockQuantity += quantity;
  }
  return this.save();
};

// Static method to get low stock items
itemSchema.statics.getLowStockItems = function(userId) {
  return this.find({
    userId,
    $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
  });
};

// Static method to get items by category
itemSchema.statics.getByCategory = function(userId, category) {
  return this.find({ userId, category, status: 'active' });
};

module.exports = mongoose.model('Item', itemSchema);
