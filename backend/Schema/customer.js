const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
    },
    phone: {
        type: String,
        maxlength: 20,
    },
    company_name: {
        type: String,
        maxlength: 255,
    },
    billing_address: {
        type: String,
    },
    shipping_address: {
        type: String,
    },
    gst_treatment: {
        type: String,
        enum: ['registered_business', 'unregistered_business', 'consumer', 'overseas'], // Example values
    },
    gstin: {
        type: String,
        maxlength: 20,
    },
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;