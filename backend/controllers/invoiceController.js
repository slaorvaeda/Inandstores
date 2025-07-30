const Invoice = require('../Schema/Invoice.model');
const Item = require('../Schema/Item.model');

// Function to generate automatic invoice number
const generateInvoiceNumber = async () => {
  try {
    // Get the latest invoice to determine the next number
    const latestInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    
    let nextNumber = 1;
    
    if (latestInvoice && latestInvoice.invoiceNumber) {
      // Extract number from existing invoice number (e.g., "INV-001" -> 1)
      const match = latestInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    
    // Format the invoice number with leading zeros (e.g., INV-001, INV-002, etc.)
    const formattedNumber = `INV-${nextNumber.toString().padStart(3, '0')}`;
    
    return formattedNumber;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback to timestamp-based number if there's an error
    const timestamp = Date.now();
    return `INV-${timestamp}`;
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoiceData = { ...req.body };
    
    // Generate automatic invoice number if not provided
    if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.trim() === '') {
      invoiceData.invoiceNumber = await generateInvoiceNumber();
    }
    
    const invoice = new Invoice(invoiceData);
    
    // Update stock quantities for each item in the invoice
    for (const item of invoice.items) {
      if (item.itemId) {
        const dbItem = await Item.findById(item.itemId);
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
    res.status(400).json({ error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().populate('client');
  res.json(invoices);
};

exports.getAllInvoices =  async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('client'); 
    res.json({invoices});
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
}


exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Invoice deleted' });
};
