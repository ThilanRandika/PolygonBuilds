const express = require('express');
const router = express.Router();
const Order = require('../../models/Order'); 

// Create a new order
router.post('/create-order', async (req, res) => {
    const { user_id, model, quantity, material, color, quality, specialInstructions,  infilType, verticalResolution, } = req.body;

    try {
        // Create a new order
        const newOrder = new Order({
            user_id,
            model,
            quantity,
            material,
            color,
            quality,
            specialInstructions,
            infilType,
            verticalResolution,
            status: 1  // Assuming new orders are 'active' by default
        });

        // Save to the database
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating order' });
    }
});

module.exports = router;
