const express = require('express');
const router = express.Router();
const Cart = require('../../models/customer/Cart');

// Create a new order
router.post('/add', async (req, res) => {
    const { user_id, model, quantity, material, color, quality, specialInstructions, infilType, verticalResolution,  process, fileUnits, infill, layerHeight, technicalDrawing, printOrientation, tolerance, cosmeticSide, industryDescription, hardnessDescription } = req.body;

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
            status: 1,
            process,
            fileUnits,
            infill,
            layerHeight,
            technicalDrawing,
            printOrientation,
            tolerance,
            cosmeticSide,
            industryDescription,
            hardnessDescription,
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

// Update a single cart item by cart ID
router.put('/update/:id', async (req, res) => {
    const cartId = req.params.id;
    const {
        quantity,
        material,
        color,
        quality,
        specialInstructions,
        infilType,
        verticalResolution,
        process,
        fileUnits,
        infill,
        layerHeight,
        technicalDrawing,
        printOrientation,
        tolerance,
        cosmeticSide,
        industryDescription,
        hardnessDescription,
    } = req.body;

    try {
        // Find the cart item by ID and update its details
        const updatedCartItem = await Cart.findByIdAndUpdate(
            cartId,
            {
                $set: {
                    quantity,
                    material,
                    color,
                    quality,
                    specialInstructions,
                    infilType,
                    verticalResolution,
                    process,
                    fileUnits,
                    infill,
                    layerHeight,
                    technicalDrawing,
                    printOrientation,
                    tolerance,
                    cosmeticSide,
                    industryDescription,
                    hardnessDescription,
                },
            },
            { new: true } // Return the updated document
        );

        // If no cart item was found with the given ID
        if (!updatedCartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Return the updated cart item
        res.status(200).json({ message: 'Cart item updated successfully', cartItem: updatedCartItem });
    } catch (err) {
        console.error('Error updating cart item:', err.message);
        res.status(500).json({ error: 'Error updating cart item' });
    }
});

// Delete a single cart item by cart ID
router.delete('/delete/:id', async (req, res) => {
    const cartId = req.params.id;

    try {
        // Find the cart item by its ID and delete it
        const deletedCartItem = await Cart.findByIdAndDelete(cartId);

        // If no cart item was found with the given ID
        if (!deletedCartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Return a success message
        res.status(200).json({ message: 'Cart item deleted successfully', cartItem: deletedCartItem });
    } catch (err) {
        console.error('Error deleting cart item:', err.message);
        res.status(500).json({ error: 'Error deleting cart item' });
    }
});




module.exports = router;
