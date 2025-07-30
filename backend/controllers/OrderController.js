const Order = require('../Schema/Order.model')
const Item = require('../Schema/Item.model')

async function createOrder(req, res) {
  try {
    const user = req.user;  // from auth middleware
    const { client, orderNumber, currency, items, discount = 0, customerNotes = '' } = req.body;

    if (!user || !client || !orderNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const itemIds = items.map(i => i.item);
    const dbItems = await Item.find({ _id: { $in: itemIds } });

    if (dbItems.length !== items.length) {
      return res.status(400).json({ message: 'One or more items not found.' });
    }

    let subTotal = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const dbItem = dbItems.find(i => i._id.toString() === orderItem.item);

      if (!dbItem) {
        return res.status(400).json({ message: `Item ${orderItem.item} not found.` });
      }

      if (orderItem.quantity > dbItem.stockQuantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for item ${dbItem.name}. Available: ${dbItem.stockQuantity}` 
        });
      }

      const price = dbItem.salesInfo?.sellingPrice || 0;
      const amount = orderItem.quantity * price;

      subTotal += amount;

      orderItems.push({
        item: dbItem._id,
        quantity: orderItem.quantity,
        rate: price,
        amount,
      });
    }

    const cgstAmount = subTotal * 0.09; 
    const sgstAmount = subTotal * 0.09;
    const igstAmount = 0;

    const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount - discount;

    // Deduct stock
    const bulkOperations = items.map(orderItem => ({
      updateOne: {
        filter: { _id: orderItem.item },
        update: { $inc: { stockQuantity: -orderItem.quantity } }
      }
    }));

    await Item.bulkWrite(bulkOperations);

    const order = new Order({
      user,
      client,
      orderNumber,
      currency: currency || 'INR',
      status: 'Unpaid',
      items: orderItems,
      subTotal,
      discount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      customerNotes,
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully.', order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order.', error: error.message });
  }
}

module.exports = { createOrder };
