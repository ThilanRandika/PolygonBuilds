const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart');

// Create a new order
router.post('/add', async (req, res) => {
    const { user_id, model, quantity, material, color, quality, specialInstructions, infilType, verticalResolution } = req.body;

    try {
        const newOrder = new Cart({
            user_id,
            model,
            quantity,
            material,
            color,
            quality,
            specialInstructions,
            infilType,
            verticalResolution,
            status: 1
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Get all orders (for admin)
router.get('/all-cart', async (req, res) => {
    try {
        const carts = await Cart.find().sort({ date: -1 }); // Use a different variable name
        res.status(200).json(carts);
    } catch (err) {
        console.error('Error fetching Carts:', err.message);
        res.status(500).json({ error: 'Failed to fetch Carts' });
    }
});

// Get a single cart item by cart ID
router.get('/cartItem/:id', async (req, res) => {
    const cartId = req.params.id;

    try {
        // Find the cart item by its ID
        const cartItem = await Cart.findById(cartId);

        // If the cart item is not found
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Return the cart item
        res.status(200).json(cartItem);
    } catch (err) {
        console.error('Error fetching cart item:', err.message);
        res.status(500).json({ error: 'Error fetching cart item' });
    }
});



module.exports = router;
