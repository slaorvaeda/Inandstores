const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  taxRate: { type: Number},
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  orderNumber: String,
  currency: String,
  orderDate: Date,
  items: [itemSchema],
  subTotal: Number,
  discount: Number,
  cgstAmount: Number,
  sgstAmount: Number,
  igstAmount: Number,
  roundOff: Number,
  totalAmount: Number,
  customerNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
