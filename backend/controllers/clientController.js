const Client = require('../Schema/Client.model');
const Invoice = require('../Schema/Invoice.model');
const mongoose = require('mongoose');

exports.createClient = async (req, res) => {
  try {
    const client = new Client({
      ...req.body,
      userId: req.user.id
    });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    // Convert userId to ObjectId for proper matching
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Use aggregation to get clients with their invoice counts and total revenue
    const clients = await Client.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $lookup: {
          from: 'invoices', // collection name (lowercase)
          localField: '_id',
          foreignField: 'client',
          as: 'invoices'
        }
      },
      {
        $addFields: {
          invoiceCount: { $size: '$invoices' },
          totalRevenue: { $sum: '$invoices.totalAmount' }
        }
      },
      {
        $project: {
          invoices: 0 // Remove the invoices array from the result
        }
      }
    ]);
    
    res.json({ clients });
    
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user.id });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, userId: req.user.id }, 
      updatedData, 
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
};
