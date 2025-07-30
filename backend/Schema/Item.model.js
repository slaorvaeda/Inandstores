const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String },
  unit: { type: String },
  hsnCode: { type: String },
  taxPreference: { type: String, enum: ['Taxable', 'Non-Taxable'], default: 'Taxable' },
  images: [{ type: String }],

  // Stock management fields
  stockQuantity: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },

  salesInfo: {
    sellingPrice: { type: Number },
    account: { type: String },
    description: { type: String },
    intraTaxRate: { type: String },
    interTaxRate: { type: String },
  },

  purchaseInfo: {
    costPrice: { type: Number },
    account: { type: String },
    description: { type: String },
    preferredVendor: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
