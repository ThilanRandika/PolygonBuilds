const mongoose = require('mongoose');

// Define the schema for Order
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Refers to a user from the Customer model
        ref: 'Customer',
        required: true
    },
    model: {
        type: String,
        required: true,
        maxlength: 500
    },
    material: {
        type: Number, // Assuming material type is mapped to some predefined number
        required: true
    },
    color: {
        type: Number, // Assuming color is an integer representing some color code
        required: true
    },
    quality: {
        type: Number, // Assuming quality is represented by an integer
        required: true
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
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
