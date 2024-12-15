const mongoose = require('mongoose');

// Define the schema for Order
const orderSchema = new mongoose.Schema({
    user_id: {
        type: String, // Refers to a user from the Customer model
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
        type: String,  // Status of the order
        default: "Quotation Pending"
    },
    quotation: {
        fileUrl: {
            type: String, // URL to the uploaded quotation file
            required: false
        },
        date: {
            type: Date, // Date the quotation was added
            default: null
        },
        specialNotes: {
            type: String, // Optional notes about the quotation
            required: false
        }
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Create the model using the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
