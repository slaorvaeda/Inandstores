const Vendor = require('../Schema/Vender.model'); 
const verifyToken = require('../middleware/auth');


exports.createVender = async (req, res) => {
    try {
        const vendor = new Vendor({
        ...req.body,
        userId: req.user.id
        });
        const savedVendor = await vendor.save();
        res.status(201).json(savedVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getVenders = async (req, res) => {
    try {
        const vendors = await Vendor.find({ userId: req.user.id });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getVenderById = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ _id: req.params.id, userId: req.user.id });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateVender = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedVendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(updatedVendor);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteVender = async (req, res) => {
    try {
        const deletedVendor = await Vendor.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!deletedVendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};








