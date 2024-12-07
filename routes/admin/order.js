const express = require('express');
const router = express.Router();
const Order = require('../../models/Order'); 
const Cart = require('../../models/Cart');



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



module.exports = router;
