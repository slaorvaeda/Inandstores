const Invoice = require('../Schema/Invoice.model');
const Item = require('../Schema/Item.model');
const mongoose = require('mongoose');
const AutoNumberGenerator = require('../utils/autoNumberGenerator');

exports.getNextInvoiceNumber = async (req, res) => {
  try {
    const result = await AutoNumberGenerator.getNextInvoiceNumber(req.user.id);
    res.status(200).json({ 
      nextInvoiceNumber: result.nextInvoiceNumber,
      currentYear: result.currentYear 
    });
  } catch (err) {
    console.error('Error getting next invoice number:', err);
    res.status(500).json({ error: 'Server error getting next invoice number.' });
  }
};

// Function to generate automatic invoice number
const generateInvoiceNumber = async (userId) => {
  try {
    const result = await AutoNumberGenerator.getNextInvoiceNumber(userId);
    return result.nextInvoiceNumber;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback to timestamp-based number if there's an error
    const timestamp = Date.now();
    return `INV-${timestamp}`;
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoiceData = { 
      ...req.body,
      userId: req.user.id
    };
    
    // Generate automatic invoice number if not provided
    if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.trim() === '') {
      invoiceData.invoiceNumber = await generateInvoiceNumber(req.user.id);
    }
    
    const invoice = new Invoice(invoiceData);
    
    // Update stock quantities for each item in the invoice
    for (const item of invoice.items) {
      if (item.itemId) {
        const dbItem = await Item.findOne({ _id: item.itemId, userId: req.user.id });
        if (dbItem) {
          // Check if sufficient stock is available
          if (dbItem.stockQuantity < item.quantity) {
            return res.status(400).json({ 
              error: `Insufficient stock for item "${item.itemName}". Available: ${dbItem.stockQuantity}, Required: ${item.quantity}` 
            });
          }
          
          // Reduce stock quantity
          dbItem.stockQuantity -= item.quantity;
          await dbItem.save();
        }
      }
    }
    
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Error creating invoice:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(400).json({ error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user.id }).populate('client');
  res.json(invoices);
};

exports.getAllInvoices = async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments({ userId: req.user.id });
    const allInvoices = await Invoice.countDocuments({});
    
    const invoices = await Invoice.find({ userId: req.user.id }).populate('client'); 
    
    res.json({invoices});
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Failed to fetch invoices', details: error.message });
  }
}

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id }).populate('client');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
