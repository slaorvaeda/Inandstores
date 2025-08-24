const PurchaseBill = require('../Schema/PurchaseBill.model');
const AutoNumberGenerator = require('../utils/autoNumberGenerator');

exports.createPurchaseBill = async (req, res) => {
  try {
    const {
      billNumber,
      vendor,
      billDate,
      dueDate,
      items,
      subTotal,
      totalAmount,
      notes,
    } = req.body;

    // Validate required fields
    if (!billNumber || !vendor || !billDate) {
      return res.status(400).json({ error: 'Bill number, vendor, and bill date are required.' });
    }

    // Validate that items is an array of objects
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required.' });
    }

    // Validate each item has required fields
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.itemName || !item.quantity || !item.rate) {
        return res.status(400).json({ 
          error: `Item ${i + 1} is missing required fields: itemName, quantity, or rate.` 
        });
      }
      
      // Calculate tax amount if not provided
      if (item.taxRate && !item.taxAmount) {
        const amount = item.quantity * item.rate;
        item.taxAmount = (amount * item.taxRate) / 100;
      }
      
      // Calculate total if not provided
      if (!item.total) {
        const amount = item.quantity * item.rate;
        const taxAmount = item.taxAmount || 0;
        item.total = amount + taxAmount;
      }
    }

    // Create the PurchaseBill
    const newBill = new PurchaseBill({
      userId: req.user.id, // Set userId from authenticated user
      billNumber,
      vendor,
      billDate: new Date(billDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      items,
      subTotal,
      totalAmount,
      notes,
    });

    await newBill.save();

    res.status(201).json({ message: 'Purchase Bill created successfully.', bill: newBill });
  } catch (err) {
    console.error('Error creating purchase bill:', err);
    res.status(500).json({ 
      error: 'Server error creating purchase bill.',
      details: err.message
    });
  }
};


exports.getBills = async (req, res) => {
  try {
    const bills = await PurchaseBill.find({ userId: req.user.id }).populate('vendor', 'name'); 
    res.status(200).json(bills);
  } catch (err) {
    console.error('Error fetching purchase bills:', err);
    res.status(500).json({ error: 'Server error fetching purchase bills.' });
  }
}
exports.getBillById = async (req, res) => {
  try {
    const bill = await PurchaseBill.findOne({ _id: req.params.id, userId: req.user.id }).populate('vendor', 'name'); // Populate vendor name
    if (!bill) {
      return res.status(404).json({ error: 'Purchase Bill not found.' });
    }
    res.status(200).json(bill);
  } catch (err) {
    console.error('Error fetching purchase bill:', err);
    res.status(500).json({ error: 'Server error fetching purchase bill.' });
  }
};
exports.updateBill = async (req, res) => {
  try {
    const updatedBill = await PurchaseBill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true }
    ).populate('vendor', 'name'); // Populate vendor name
    if (!updatedBill) {
      return res.status(404).json({ error: 'Purchase Bill not found.' });
    }
    res.status(200).json({ message: 'Purchase Bill updated successfully.', bill: updatedBill });
  }
  catch (err) {
    console.error('Error updating purchase bill:', err);
    res.status(500).json({ error: 'Server error updating purchase bill.' });
  }
};
exports.deleteBill = async (req, res) => {
  try {
    const deletedBill = await PurchaseBill.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedBill) {
      return res.status(404).json({ error: 'Purchase Bill not found.' });
    }
    res.status(200).json({ message: 'Purchase Bill deleted successfully.' });
  } catch (err) {
    console.error('Error deleting purchase bill:', err);
    res.status(500).json({ error: 'Server error deleting purchase bill.' });
  }
};

exports.getNextBillNumber = async (req, res) => {
  try {
    const result = await AutoNumberGenerator.getNextPurchaseBillNumber(req.user.id);
    res.status(200).json({ 
      nextBillNumber: result.nextBillNumber,
      currentYear: result.currentYear 
    });
  } catch (err) {
    console.error('Error getting next bill number:', err);
    res.status(500).json({ error: 'Server error getting next bill number.' });
  }
};