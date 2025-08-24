const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const PurchaseBillController = require('../controllers/purchaseBillConntroller');

router.use(verifyToken);



router.post('/create', PurchaseBillController.createPurchaseBill);
router.get('/next-number', PurchaseBillController.getNextBillNumber);
router.get('/', PurchaseBillController.getBills);
router.get('/:id', PurchaseBillController.getBillById);
router.put('/:id', PurchaseBillController.updateBill);
router.delete('/:id', PurchaseBillController.deleteBill);

module.exports = router;



// GET all purchase bills
// router.get('/purchase-bills', authMiddleware, async (req, res) => {
//     const bills = await PurchaseBill.find();
//     res.json(bills);
//   });
  
//   // GET one purchase bill
//   router.get('/purchase-bills/:id', authMiddleware, async (req, res) => {
//     const bill = await PurchaseBill.findById(req.params.id);
//     res.json(bill);
//   });
  
//   // PUT update purchase bill
//   router.put('/purchase-bills/:id', authMiddleware, async (req, res) => {
//     const updated = await PurchaseBill.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   });
  