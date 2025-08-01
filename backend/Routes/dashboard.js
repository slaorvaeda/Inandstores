const express = require('express');
const router = express.Router();
const Client = require('../Schema/Client.model')
const Vendor = require('../Schema/Vender.model')
const Item = require('../Schema/Item.model')
const Invoice = require('../Schema/Invoice.model')
const PurchaseBill = require('../Schema/PurchaseBill.model');

router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.query.userId;
    // Counts
    const clientsCount = await Client.countDocuments();
    const vendorsCount = await Vendor.countDocuments();
    const itemsCount = await Item.countDocuments({ userId });
    const invoicesCount = await Invoice.countDocuments();
    const purchaseBillsCount = await PurchaseBill.countDocuments();

    // Recent invoices and purchase bills (populate client/vendor names)
    const recentInvoices = await Invoice.find()
      .sort({ invoiceDate: -1 })
      .limit(5)
      .populate('client', 'name');

    const recentPurchaseBills = await PurchaseBill.find()
      .sort({ billDate: -1 })
      .limit(5)
      .populate('vendor', 'name');

    // Total sales this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalSalesThisMonth = await Invoice.aggregate([
      { $match: { invoiceDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Total purchase this month
    const totalPurchaseThisMonth = await PurchaseBill.aggregate([
      { $match: { billDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Top clients by invoice total (last 6 months)
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
    const topClients = await Invoice.aggregate([
      { $match: { invoiceDate: { $gte: sixMonthsAgo } } },
      { $group: { _id: '$client', totalSpent: { $sum: '$totalAmount' } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'clientDetails',
        },
      },
      { $unwind: '$clientDetails' },
      { $project: { clientName: '$clientDetails.name', totalSpent: 1 } },
    ]);

    // Top vendors by purchase total (last 6 months)
    const topVendors = await PurchaseBill.aggregate([
      { $match: { billDate: { $gte: sixMonthsAgo } } },
      { $group: { _id: '$vendor', totalSpent: { $sum: '$totalAmount' } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorDetails',
        },
      },
      { $unwind: '$vendorDetails' },
      { $project: { vendorName: '$vendorDetails.name', totalSpent: 1 } },
    ]);

    res.json({
      counts: { clientsCount, vendorsCount, itemsCount, invoicesCount, purchaseBillsCount },
      recentInvoices,
      recentPurchaseBills,
      totals: {
        salesThisMonth: totalSalesThisMonth[0]?.total || 0,
        purchaseThisMonth: totalPurchaseThisMonth[0]?.total || 0,
      },
      topClients,
      topVendors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
