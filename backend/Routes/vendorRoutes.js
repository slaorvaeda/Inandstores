const express = require('express');
const router = express.Router();
const Vendor = require('../Schema/Vender.model');
const verifyToken = require('../middleware/auth');
const vendorController = require('../controllers/venderController');

//CREATE Vendor
router.post('/', verifyToken, vendorController.createVender);

//READ All Vendors 
router.get('/', verifyToken, vendorController.getVenders);

//READ One Vendor by ID 
router.get('/:id', verifyToken, vendorController.getVenderById);

//UPDATE Vendor
router.put('/:id', verifyToken, vendorController.updateVender);

//DELETE Vendor
router.delete('/:id', verifyToken, vendorController.deleteVender);

module.exports = router;
