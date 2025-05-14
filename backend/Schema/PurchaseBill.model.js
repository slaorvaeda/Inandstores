const mongoose = require('mongoose');

const PurchaseItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const PurchaseBillSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  billDate: { type: Date, required: true },
  dueDate: { type: Date },

  items: [PurchaseItemSchema],

  subTotal: { type: Number, required: true },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  notes: { type: String },

  attachments: [{
    filename: String,
    url: String
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PurchaseBillSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PurchaseBill', PurchaseBillSchema);
