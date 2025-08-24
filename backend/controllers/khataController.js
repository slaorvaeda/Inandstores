const KhataBook = require('../Schema/KhataBook.model');
const KhataEntry = require('../Schema/KhataEntry.model');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middleware/ErrorHandler');

// Create a new khata book
const createKhata = asyncHandler(async (req, res) => {
  const { personName, phone, address, notes, ledgerType, clientId, vendorId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!personName || !personName.trim()) {
    throw new ApiError(400, 'Person name is required');
  }

  if (!ledgerType || !['client', 'vendor'].includes(ledgerType)) {
    throw new ApiError(400, 'Ledger type must be either "client" or "vendor"');
  }

  // Check if khata already exists for this person
  const existingKhata = await KhataBook.findOne({ 
    userId, 
    personName: { $regex: new RegExp(`^${personName.trim()}$`, 'i') }
  });

  if (existingKhata) {
    throw new ApiError(400, 'Khata already exists for this person');
  }

  const khataData = {
    userId,
    personName: personName.trim(),
    phone: phone ? phone.trim() : '',
    address: address ? address.trim() : '',
    notes: notes ? notes.trim() : '',
    ledgerType
  };

  // Add reference based on ledger type (only if provided)
  if (ledgerType === 'client' && clientId) {
    khataData.clientId = clientId;
  } else if (ledgerType === 'vendor' && vendorId) {
    khataData.vendorId = vendorId;
  }

  const khata = new KhataBook(khataData);
  await khata.save();

  res.status(201).json({
    success: true,
    message: 'Khata created successfully',
    data: khata
  });
});

// Create khata from existing client
const createClientKhata = asyncHandler(async (req, res) => {
  const { clientId, notes } = req.body;
  const userId = req.user.id;

  // Import Client model
  const Client = require('../Schema/Client.model');
  
  // Get client details
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) {
    throw new ApiError(404, 'Client not found');
  }

  // Check if khata already exists for this client
  const existingKhata = await KhataBook.findOne({ 
    userId, 
    clientId,
    ledgerType: 'client'
  });

  if (existingKhata) {
    throw new ApiError(400, 'Khata already exists for this client');
  }

  const khata = new KhataBook({
    userId,
    ledgerType: 'client',
    clientId,
    personName: client.name,
    phone: client.phone,
    address: client.address,
    notes
  });

  await khata.save();

  res.status(201).json({
    success: true,
    message: 'Client khata created successfully',
    data: khata
  });
});

// Create khata from existing vendor
const createVendorKhata = asyncHandler(async (req, res) => {
  const { vendorId, notes } = req.body;
  const userId = req.user.id;

  // Import Vendor model
  const Vendor = require('../Schema/Vender.model');
  
  // Get vendor details
  const vendor = await Vendor.findOne({ _id: vendorId, userId });
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  // Check if khata already exists for this vendor
  const existingKhata = await KhataBook.findOne({ 
    userId, 
    vendorId,
    ledgerType: 'vendor'
  });

  if (existingKhata) {
    throw new ApiError(400, 'Khata already exists for this vendor');
  }

  const khata = new KhataBook({
    userId,
    ledgerType: 'vendor',
    vendorId,
    personName: vendor.name,
    phone: vendor.phone,
    address: vendor.address,
    notes
  });

  await khata.save();

  res.status(201).json({
    success: true,
    message: 'Vendor khata created successfully',
    data: khata
  });
});

// Get all khatas for a user
const getAllKhatas = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { search, status, page = 1, limit = 10, ledgerType } = req.query;

  let query = { userId };
  
  if (ledgerType && ['client', 'vendor'].includes(ledgerType)) {
    query.ledgerType = ledgerType;
  }
  
  if (status) {
    query.status = status;
  }

  if (search) {
    query = {
      userId,
      ...(ledgerType && { ledgerType }),
      $or: [
        { personName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const skip = (page - 1) * limit;
  
  let khatas;
  if (ledgerType === 'client') {
    khatas = await KhataBook.getClientKhatas(userId);
  } else if (ledgerType === 'vendor') {
    khatas = await KhataBook.getVendorKhatas(userId);
  } else {
    khatas = await KhataBook.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
  }

  const total = await KhataBook.countDocuments(query);

  res.json({
    success: true,
    data: khatas,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get a specific khata with entries
const getKhata = asyncHandler(async (req, res) => {
  const { khataId } = req.params;
  const userId = req.user.id;

  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  // Get recent entries
  const entries = await KhataEntry.find({ khataId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    data: {
      khata,
      entries
    }
  });
});

// Add an entry to khata
const addEntry = asyncHandler(async (req, res) => {
  const { khataId } = req.params;
  const { type, amount, description, transactionDate, notes } = req.body;
  const userId = req.user.id;

  // Validate khata
  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  // Validate entry type
  if (!['credit', 'debit'].includes(type)) {
    throw new ApiError(400, 'Invalid entry type');
  }

  // Calculate new balance
  const balanceBefore = khata.currentBalance;
  let balanceAfter;

  if (type === 'credit') {
    balanceAfter = balanceBefore + amount;
  } else {
    balanceAfter = balanceBefore - amount;
  }

  // Create entry
  const entry = new KhataEntry({
    khataId,
    userId,
    type,
    amount,
    description,
    transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
    balanceAfter,
    notes
  });

  await entry.save();

  // Update khata balance
  if (type === 'credit') {
    await khata.addCredit(amount);
  } else {
    await khata.addDebit(amount);
  }

  res.status(201).json({
    success: true,
    message: 'Entry added successfully',
    data: {
      entry,
      updatedBalance: khata.currentBalance
    }
  });
});

// Get entries for a khata
const getEntries = asyncHandler(async (req, res) => {
  const { khataId } = req.params;
  const { page = 1, limit = 20, includeDeleted = false } = req.query;
  const userId = req.user.id;

  // Validate khata
  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  const skip = (page - 1) * limit;
  
  // Build query - include deleted entries only if requested
  const query = { khataId };
  if (!includeDeleted) {
    query.isDeleted = { $ne: true };
  }
  
  const entries = await KhataEntry.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await KhataEntry.countDocuments(query);

  res.json({
    success: true,
    data: entries,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Update khata details
const updateKhata = asyncHandler(async (req, res) => {
  const { khataId } = req.params;
  const { personName, phone, address, notes, status } = req.body;
  const userId = req.user.id;

  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  // Update fields
  if (personName) khata.personName = personName;
  if (phone !== undefined) khata.phone = phone;
  if (address !== undefined) khata.address = address;
  if (notes !== undefined) khata.notes = notes;
  if (status) khata.status = status;

  await khata.save();

  res.json({
    success: true,
    message: 'Khata updated successfully',
    data: khata
  });
});

// Get khata summary
const getKhataSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { ledgerType } = req.query;

  let query = { userId };
  if (ledgerType && ['client', 'vendor'].includes(ledgerType)) {
    query.ledgerType = ledgerType;
  }

  const khatas = await KhataBook.find(query);
  
  const summary = {
    totalKhatas: khatas.length,
    activeKhatas: khatas.filter(k => k.status === 'active').length,
    closedKhatas: khatas.filter(k => k.status === 'closed').length,
    totalOutstanding: khatas.reduce((sum, k) => sum + Math.max(0, k.currentBalance), 0),
    totalCredit: khatas.reduce((sum, k) => sum + k.totalCredit, 0),
    totalDebit: khatas.reduce((sum, k) => sum + k.totalDebit, 0)
  };

  // Get recent entries
  const recentEntries = await KhataEntry.getRecentEntries(userId, 10);

  res.json({
    success: true,
    data: {
      summary,
      recentEntries
    }
  });
});

// Get separate summaries for clients and vendors
const getSeparateSummaries = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get client khatas
  const clientKhatas = await KhataBook.getClientKhatas(userId);
  const clientSummary = {
    totalKhatas: clientKhatas.length,
    activeKhatas: clientKhatas.filter(k => k.status === 'active').length,
    closedKhatas: clientKhatas.filter(k => k.status === 'closed').length,
    totalOutstanding: clientKhatas.reduce((sum, k) => sum + Math.max(0, k.currentBalance), 0),
    totalCredit: clientKhatas.reduce((sum, k) => sum + k.totalCredit, 0),
    totalDebit: clientKhatas.reduce((sum, k) => sum + k.totalDebit, 0)
  };

  // Get vendor khatas
  const vendorKhatas = await KhataBook.getVendorKhatas(userId);
  const vendorSummary = {
    totalKhatas: vendorKhatas.length,
    activeKhatas: vendorKhatas.filter(k => k.status === 'active').length,
    closedKhatas: vendorKhatas.filter(k => k.status === 'closed').length,
    totalOutstanding: vendorKhatas.reduce((sum, k) => sum + Math.max(0, k.currentBalance), 0),
    totalCredit: vendorKhatas.reduce((sum, k) => sum + k.totalCredit, 0),
    totalDebit: vendorKhatas.reduce((sum, k) => sum + k.totalDebit, 0)
  };

  // Overall summary
  const overallSummary = {
    totalKhatas: clientSummary.totalKhatas + vendorSummary.totalKhatas,
    totalOutstanding: clientSummary.totalOutstanding + vendorSummary.totalOutstanding,
    totalCredit: clientSummary.totalCredit + vendorSummary.totalCredit,
    totalDebit: clientSummary.totalDebit + vendorSummary.totalDebit
  };

  res.json({
    success: true,
    data: {
      overall: overallSummary,
      clients: clientSummary,
      vendors: vendorSummary
    }
  });
});

// Delete entry (soft delete)
const deleteEntry = asyncHandler(async (req, res) => {
  const { khataId, entryId } = req.params;
  const userId = req.user.id;

  // Verify khata belongs to user
  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  // Find the entry
  const entry = await KhataEntry.findOne({ _id: entryId, khataId });
  if (!entry) {
    throw new ApiError(404, 'Entry not found');
  }

  // Soft delete the entry
  entry.isDeleted = true;
  entry.deletedAt = new Date();
  await entry.save();

  // Recalculate khata balances
  await recalculateKhataBalances(khataId);

  res.json({
    success: true,
    message: 'Entry deleted successfully',
    data: entry
  });
});

// Restore deleted entry
const restoreEntry = asyncHandler(async (req, res) => {
  const { khataId, entryId } = req.params;
  const userId = req.user.id;

  // Verify khata belongs to user
  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  // Find the entry
  const entry = await KhataEntry.findOne({ _id: entryId, khataId });
  if (!entry) {
    throw new ApiError(404, 'Entry not found');
  }

  // Restore the entry
  entry.isDeleted = false;
  entry.deletedAt = null;
  await entry.save();

  // Recalculate khata balances
  await recalculateKhataBalances(khataId);

  res.json({
    success: true,
    message: 'Entry restored successfully',
    data: entry
  });
});

// Helper function to recalculate khata balances
const recalculateKhataBalances = async (khataId) => {
  const entries = await KhataEntry.find({ 
    khataId, 
    isDeleted: { $ne: true } // Only count non-deleted entries
  }).sort({ createdAt: 1 });

  let currentBalance = 0;
  let totalCredit = 0;
  let totalDebit = 0;

  for (const entry of entries) {
    if (entry.type === 'credit') {
      currentBalance += entry.amount;
      totalCredit += entry.amount;
    } else {
      currentBalance -= entry.amount;
      totalDebit += entry.amount;
    }
  }

  // Update khata with new balances
  await KhataBook.findByIdAndUpdate(khataId, {
    currentBalance,
    totalCredit,
    totalDebit,
    updatedAt: new Date()
  });
};

// Delete khata (soft delete by closing it)
const closeKhata = asyncHandler(async (req, res) => {
  const { khataId } = req.params;
  const userId = req.user.id;

  const khata = await KhataBook.findOne({ _id: khataId, userId });
  if (!khata) {
    throw new ApiError(404, 'Khata not found');
  }

  khata.status = 'closed';
  await khata.save();

  res.json({
    success: true,
    message: 'Khata closed successfully',
    data: khata
  });
});

module.exports = {
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
};
