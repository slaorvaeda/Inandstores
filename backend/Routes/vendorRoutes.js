const express = require('express');
const router = express.Router();
const Vendor = require('../Schema/Vender.model');
const authenticateToken = require('../middleware/auth');
const vendorController = require('../controllers/venderController');

//CREATE Vendor
router.post('/', authenticateToken, vendorController.createVender);

//READ All Vendors 
router.get('/', authenticateToken, vendorController.getVenders);

//READ One Vendor by ID 
router.get('/:id', authenticateToken, vendorController.getVenderById);

//UPDATE Vendor
router.put('/:id', authenticateToken, vendorController.updateVender);

//DELETE Vendor
router.delete('/:id', authenticateToken, vendorController.deleteVender);

module.exports = router;
