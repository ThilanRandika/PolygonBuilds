const express = require('express');
const router = express.Router();
const Order = require('../../models/customer/Order'); 
const Cart = require('../../models/customer/Cart');



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



// Get order details by ID
router.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});




module.exports = router;
