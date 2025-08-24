const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createKhata,
  createClientKhata,
  createVendorKhata,
  getAllKhatas,
  getKhata,
  addEntry,
  getEntries,
  updateKhata,
  getKhataSummary,
  getSeparateSummaries,
  closeKhata,
  deleteEntry,
  restoreEntry
} = require('../controllers/khataController');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Khata CRUD operations
router.post('/', createKhata);
router.post('/client', createClientKhata);
router.post('/vendor', createVendorKhata);
router.get('/', getAllKhatas);
router.get('/summary', getKhataSummary);
router.get('/summaries', getSeparateSummaries);

// Specific khata operations
router.get('/:khataId', getKhata);
router.put('/:khataId', updateKhata);
router.delete('/:khataId', closeKhata);

// Entry operations
router.post('/:khataId/entries', addEntry);
router.get('/:khataId/entries', getEntries);
router.delete('/:khataId/entries/:entryId', deleteEntry);
router.put('/:khataId/entries/:entryId/restore', restoreEntry);

module.exports = router;
