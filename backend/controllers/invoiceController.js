const Invoice = require('../Schema/Invoice.model');

exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
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
    const invoices = await Invoice.find(); 
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
