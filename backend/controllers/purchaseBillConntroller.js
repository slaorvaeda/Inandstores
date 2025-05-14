const PurchaseBill = require('../Schema/PurchaseBill.model');

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

    // Validate that items is an array of objects
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required.' });
    }

    // Create the PurchaseBill
    const newBill = new PurchaseBill({
      billNumber,
      vendor,
      billDate,
      dueDate,
      items,
      subTotal,
      totalAmount,
      notes,
      createdBy: req.user.id, // assuming authentication middleware sets req.user
    });

    await newBill.save();

    res.status(201).json({ message: 'Purchase Bill created successfully.', bill: newBill });
  } catch (err) {
    console.error('Error creating purchase bill:', err);
    res.status(500).json({ error: 'Server error creating purchase bill.' });
  }
};


exports.getBills = async (req, res) => {
  try {
    const bills = await PurchaseBill.find().populate('vendor', 'name'); 
    
    res.status(200).json(bills);
  } catch (err) {
    console.error('Error fetching purchase bills:', err);
    res.status(500).json({ error: 'Server error fetching purchase bills.' });
  }
}
exports.getBillById = async (req, res) => {
  try {
    const bill = await PurchaseBill.findById(req.params.id);
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
    const updatedBill = await PurchaseBill.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const deletedBill = await PurchaseBill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ error: 'Purchase Bill not found.' });
    }
    res.status(200).json({ message: 'Purchase Bill deleted successfully.' });
  } catch (err) {
    console.error('Error deleting purchase bill:', err);
    res.status(500).json({ error: 'Server error deleting purchase bill.' });
  }
};