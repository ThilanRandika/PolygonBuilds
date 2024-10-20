const mongoose = require('mongoose');

// Define the schema for Customer
const customerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 200
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 200
    },
    mobile: {
        type: String,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures no duplicate emails
        maxlength: 200
    },
    password: {
        type: String,
        required: true,
        maxlength: 200
    },
    role: {
        type: Number,  // 1: Admin, 0: Customer (Assuming role types)
        required: true,
        default: 0    // Default role is customer
    },
    active: {
        type: Boolean, // TinyInt is mapped to Boolean in MongoDB
        default: true  // Active by default
    },
    createdAt: {
        type: Date,
        default: Date.now  // Auto-generate current timestamp
    },
    updatedAt: {
        type: Date,
        default: Date.now  // Auto-generate current timestamp
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create the model using the schema
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
