const express = require('express');
const router = express.Router();
const Order = require('../../models/customer/Order'); 
const Cart = require('../../models/customer/Cart');

// Create a new order
// router.post('/create-order', async (req, res) => {
//     const { user_id, model, quantity, material, color, quality, specialInstructions,  infilType, verticalResolution, } = req.body;

//     try {
//         // Create a new order
//         const newOrder = new Order({
//             user_id,
//             model,
//             quantity,
//             material,
//             color,
//             quality,
//             specialInstructions,
//             infilType,
//             verticalResolution,
//             status: 1  // Assuming new orders are 'active' by default
//         });

//         // Save to the database
//         const savedOrder = await newOrder.save();
//         res.status(201).json({ message: 'Order created successfully', order: savedOrder });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error creating order' });
//     }
// });



// Create multiple orders (for confirming the order)
router.post('/create-multiple-orders', async (req, res) => {
    const { user_id, cartItems } = req.body; // Assuming cartItems is an array of items the user has selected

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'No items selected for order' });
    }

    console.log('Cart items to delete:', cartItems);
    console.log('Mapped IDs:', cartItems.map(item => item._id));
    console.log('User ID:', user_id);


    try {
        // Create orders from cart items
        const orders = cartItems.map(item => {
                const { _id, model, image, quantity, material, color, specialInstructions, process, finish, fileUnits, infill, layerHeight, technicalDrawing, printOrientation, tolerance, cosmeticSide, industryDescription, hardnessDescription } = item;
            return new Order({
                user_id,
                model,
                image,
                quantity,
                material,
                color,
                specialInstructions,
                process,
                finish,
                fileUnits,
                infill,
                layerHeight,
                technicalDrawing,
                printOrientation,
                tolerance,
                cosmeticSide,
                industryDescription,
                hardnessDescription,
                status: "Quotation Pending"  // New orders are 'active' by default
            });
        });

        // Save all orders to the database
        const savedOrders = await Order.insertMany(orders);

        // After successfully creating orders, delete the cart items for the user
        await Cart.deleteMany({ user_id, _id: { $in: cartItems.map(item => item._id) } });

        res.status(201).json({ message: 'Orders created successfully and cart items deleted.', orders: savedOrders });
    } catch (err) {
        console.error('Error creating orders or deleting cart items:', err);
        res.status(500).json({ error: 'Error creating orders or deleting cart items' });
    }
});






// Get all orders (for admin)
router.get('/all-orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); // Fetch all orders and sort by latest first
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});



// Get all orders for a specific user
router.get('/user-orders/:user_id', async (req, res) => {
    const userId = req.params.user_id; // Extract user_id from route parameter

    try {
        // Find all orders associated with the given user_id
        const orders = await Order.find({ user_id: userId }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});



module.exports = router;
