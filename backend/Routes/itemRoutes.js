const express = require('express');
const Item = require('../Schema/Item.model');

const verifyToken = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    const {
      userId,
      name,
      sku,
      unit,
      hsnCode,
      taxPreference,
      stockQuantity,
      reorderLevel,
      reorderQuantity,
      sellingPrice,
      salesInfo,
      purchaseInfo,
    } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const item = new Item({
      userId,
      name,
      sku,
      unit,
      hsnCode,
      taxPreference,
      stockQuantity: stockQuantity || 0,
      reorderLevel: reorderLevel || 10,
      reorderQuantity: reorderQuantity || 50,
      sellingPrice: req.body.sellingPrice || 0, // Add sellingPrice field
      salesInfo,
      purchaseInfo,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err.message);
    res.status(400).json({ error: err.message });
  }
});




router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const items = await Item.find({ userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Stock management endpoint
router.patch('/:id/stock', async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    if (!quantity || !operation) {
      return res.status(400).json({ error: 'Quantity and operation are required' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (operation === 'add') {
      item.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (item.stockQuantity < quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock. Available: ${item.stockQuantity}, Requested: ${quantity}` 
        });
      }
      item.stockQuantity -= quantity;
    } else {
      return res.status(400).json({ error: 'Invalid operation. Use "add" or "subtract"' });
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

module.exports = router;
