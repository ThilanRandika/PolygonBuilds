const mongoose = require('mongoose');

// Define the schema for Order
const cartSchema = new mongoose.Schema({
    user_id: {
        type: String, // Refers to a user from the Customer model
        // ref: 'Customer',
        required: true
    },
    model: {
        type: String,
        required: true,
        maxlength: 500
    },
    image: {
        type: String,
        maxlength: 500
    },
    quantity: {
        type: Number,
        required: true,
    },
    material: {
        type: String, // Assuming material type is mapped to some predefined String
        required: true
    },
    color: {
        type: String, // Assuming color is an integer representing some color code
        required: true
    },
    specialInstructions: {
        type: String,
        required: true,
    },
    process: {
        type: String,
    },
    finish: {
        type: String,
    },
    fileUnits: {
        type: String,
    },
    infill: {
        type: String,
    },
    layerHeight: {
        type: String,
    },
    technicalDrawing: {
        type: String,
    },
    printOrientation: {
        type: String,
    },
    tolerance: {
        type: String,
    },
    cosmeticSide: {
        type: String,
    },
    industryDescription: {
        type: String,
    },
    hardnessDescription: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now  // Automatically sets the order date to current date
    },
    status: {
        type: Number,  // 1: Active, 0: Inactive/Completed
        default: 1
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Create the model using the schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
