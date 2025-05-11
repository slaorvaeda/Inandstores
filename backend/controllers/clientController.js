const Client = require('../Schema/Client.model');

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {  const clients = await Client.find();
    res.json({clients});
    
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Internal server error' });
    
  }

};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: 'Client deleted' });
};
