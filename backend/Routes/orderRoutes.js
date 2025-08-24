const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(verifyToken);

// const orderController =require('../controllers/OrderController');
// const verifyToken = require('../middleware/auth');

// router.post('/create',  orderController.createOrder);




const Order = require('../Schema/Order.model'); // 
router.post('/create', async (req, res) => {
    try {
        // console.log('Incoming order data:', req.body);

        const {
            user:userId, // still accept userId from frontend
            client,
            orderNumber,
            currency,
            orderDate,
            items,
            subTotal,
            discount,
            cgstAmount,
            sgstAmount,
            igstAmount,
            roundOff,
            totalAmount,
            customerNotes,
        } = req.body;

        if (!client || !items?.length || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = new Order({
            user: userId, // ✅ use `user` key for Mongoose schema
            client,
            orderNumber,
            currency,
            orderDate,
            items,
            subTotal,
            discount,
            cgstAmount,
            sgstAmount,
            igstAmount,
            roundOff,
            totalAmount,
            customerNotes,
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/', async (req, res) => {
  try {
    // populate client and user references to get names
    const orders = await Order.find()
      .populate('client', 'name')
      .populate('user', 'name');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name')
      .populate('user', 'name')
      .populate('items.item', 'name'); // populate nested item details if needed

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

// UPDATE order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});




module.exports = router;
