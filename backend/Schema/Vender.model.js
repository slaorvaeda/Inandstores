const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    // Business Reference (optional - for multi-business setups)
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        index: true
    },
    
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    company: {
        type: String,
        trim: true,
        maxlength: 200
    },
    contactPerson: {
        type: String,
        trim: true,
        maxlength: 100
    },
    designation: {
        type: String,
        trim: true,
        maxlength: 100
    },

    // Contact Information
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Invalid email format'
        }
    },
    phone: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    fax: {
        type: String,
        trim: true
    },

    // Address Information
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, trim: true, default: 'India' }
    },
    shippingAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, trim: true, default: 'India' }
    },

    // Tax Information
    gstNumber: {
        type: String,
        trim: true,
        validate: {
            validator: v => !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v),
            message: 'Invalid GST number format'
        }
    },
    panNumber: {
        type: String,
        trim: true,
        validate: {
            validator: v => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
            message: 'Invalid PAN number format'
        }
    },
    tdsSection: {
        type: String,
        trim: true
    },
    tdsRate: {
        type: Number,
        min: 0,
        max: 100
    },

    // Business Information
    industry: {
        type: String,
        trim: true,
        enum: [
            'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
            'Real Estate', 'Transportation', 'Food & Beverage', 'Entertainment',
            'Consulting', 'Legal', 'Construction', 'Agriculture', 'Other'
        ]
    },
    businessType: {
        type: String,
        enum: ['Individual', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Sole Proprietorship'],
        default: 'Individual'
    },
    registrationNumber: {
        type: String,
        trim: true
    },

    // Financial Information
    creditLimit: {
        type: Number,
        default: 0,
        min: 0
    },
    paymentTerms: {
        type: Number,
        default: 30, // days
        min: 0
    },
    currency: {
        type: String,
        default: 'INR',
        enum: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    bankDetails: {
        accountNumber: { type: String, trim: true },
        ifsc: { type: String, trim: true },
        bankName: { type: String, trim: true },
        branch: { type: String, trim: true },
        upiId: { type: String, trim: true }
    },

    // Status & Classification
    status: {
        type: String,
        enum: ['active', 'inactive', 'blacklisted'],
        default: 'active'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    tags: [{
        type: String,
        trim: true
    }],

    // Performance Metrics
    performance: {
        onTimeDelivery: { type: Number, default: 0, min: 0, max: 100 }, // percentage
        qualityRating: { type: Number, default: 0, min: 0, max: 5 },
        responseTime: { type: Number, default: 0 }, // hours
        lastOrderDate: { type: Date }
    },

    // Notes & Additional Information
    notes: {
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

    // Statistics
    stats: {
        totalOrders: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        outstandingAmount: { type: Number, default: 0 },
        lastOrderDate: { type: Date },
        lastPaymentDate: { type: Date }
    },

    // Documents & Attachments
    documents: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
        size: { type: Number },
        uploadedAt: { type: Date, default: Date.now }
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
    }
}, {
    timestamps: true
});

// Indexes for better performance
vendorSchema.index({ businessId: 1, status: 1 });
vendorSchema.index({ businessId: 1, name: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ gstNumber: 1 });

// Pre-save middleware
vendorSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for full address
vendorSchema.virtual('fullAddress').get(function() {
    const addr = this.address;
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
        .filter(Boolean)
        .join(', ');
});

// Virtual for full shipping address
vendorSchema.virtual('fullShippingAddress').get(function() {
    const addr = this.shippingAddress;
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
        .filter(Boolean)
        .join(', ');
});

// Method to calculate outstanding amount
vendorSchema.methods.calculateOutstanding = function() {
    return this.stats.totalAmount - this.stats.paidAmount;
};

// Method to check if vendor is active
vendorSchema.methods.isActive = function() {
    return this.status === 'active';
};

// Method to check if vendor is reliable
vendorSchema.methods.isReliable = function() {
    return this.performance.onTimeDelivery >= 80 && this.performance.qualityRating >= 4;
};

// Static method to get vendors by status
vendorSchema.statics.getByStatus = function(userId, status) {
    return this.find({ userId, status });
};

// Static method to get reliable vendors
vendorSchema.statics.getReliableVendors = function(userId) {
    return this.find({
        userId,
        status: 'active',
        'performance.onTimeDelivery': { $gte: 80 },
        'performance.qualityRating': { $gte: 4 }
    });
};

module.exports = mongoose.model('Vendor', vendorSchema);
