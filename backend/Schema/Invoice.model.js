const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, // Reference to actual item
  itemName: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxRate: { type: Number, required: true },
  amount: { type: Number, required: true },
  
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderNumber: { type: String },
  currency: { type: String, default: 'INR' },

  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },

  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date },
  terms: { type: String },
  salesperson: { type: String },
  subject: { type: String },

  items: [InvoiceItemSchema],

  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  tcs: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  bankDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    branch: { type: String }
  },

  customerNotes: { type: String },
  termsAndConditions: { type: String },

  attachments: [{
    filename: String,
    url: String
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InvoiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
