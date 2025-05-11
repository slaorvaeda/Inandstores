const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstNumber: { type: String },
  billingAddress: { type: String },
  shippingAddress: { type: String },
  gstTreatment: {
    type: String,
    enum: ['Unregistered Business', 'Registered Business', 'Consumer', 'Overseas'],
    default: 'Unregistered Business'
  },
  placeOfSupply: { type: String },
  contact: {
    email: { type: String },
    phone: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema);
