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





// Add Quotation to an Order
router.post('/addQuotation/:id', async (req, res) => {
    const { id } = req.params; // Order ID from the URL
    const { fileUrl, specialNotes } = req.body; // Quotation details from the request body

    try {
        // Find the order by ID and update it with the quotation
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    quotation: {
                        fileUrl,
                        date: new Date(),
                        specialNotes
                    },
                    status: "Quotation Added"
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Quotation added successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error adding quotation:', error);
        res.status(500).json({ message: 'Failed to add quotation', error });
    }
});





module.exports = router;
