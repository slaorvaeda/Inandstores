import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileInvoice, FaBuilding, FaCalendarAlt, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { Button, Input, Select, Card, LoadingSpinner, Alert } from '../common';
import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

function PurchaseBillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [billData, setBillData] = useState({
    billNumber: "",
    vendor: "",
    billDate: "",
    dueDate: "",
    items: [],
    subTotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    discount: 0,
    roundOff: 0,
    totalAmount: 0,
  });

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const [billRes, vendorsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.PURCHASE_BILL_BY_ID(id), {
            headers: getAuthHeaders(),
          }),
          axios.get(API_ENDPOINTS.VENDORS, {
            headers: getAuthHeaders(),
          }),
        ]);

        setBillData(billRes.data);
        setVendors(vendorsRes.data);
      } catch (err) {
        console.error("Error loading bill or vendors:", err);
        alert("Failed to load purchase bill data. Please try again.");
        navigate("/dashboard/purchasebill");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!billData.billNumber.trim()) {
      newErrors.billNumber = 'Bill number is required';
    }
    
    if (!billData.vendor) {
      newErrors.vendor = 'Please select a vendor';
    }
    
    if (!billData.billDate) {
      newErrors.billDate = 'Bill date is required';
    }
    
    if (billData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setBillData({ ...billData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...billData.items];
    items[index][field] = value;

    // Recalculate item totals
    if (["quantity", "rate", "taxRate"].includes(field)) {
      const quantity = parseFloat(items[index].quantity) || 0;
      const rate = parseFloat(items[index].rate) || 0;
      const taxRate = parseFloat(items[index].taxRate) || 0;
      
      const amount = quantity * rate;
      const taxAmount = (amount * taxRate) / 100;
      const total = amount + taxAmount;
      
      items[index].amount = parseFloat(amount.toFixed(2));
      items[index].taxAmount = parseFloat(taxAmount.toFixed(2));
      items[index].total = parseFloat(total.toFixed(2));
    }

    setBillData({ ...billData, items });
    recalculateTotals(items);
  };

  const addItem = () => {
    const newItem = {
      itemName: "",
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0,
      discount: 0,
      discountType: 'percentage',
      amount: 0,
      hsnCode: '',
      unit: 'Nos',
      receivedQuantity: 0,
      status: 'pending'
    };
    setBillData({
      ...billData,
      items: [...billData.items, newItem],
    });
  };

  const removeItem = (index) => {
    const items = billData.items.filter((_, i) => i !== index);
    setBillData({ ...billData, items });
    recalculateTotals(items);
  };

  const recalculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const totalAmount = subTotal - (parseFloat(billData.discount) || 0) + (parseFloat(billData.roundOff) || 0);

    setBillData((prev) => ({
      ...prev,
      subTotal: parseFloat(subTotal.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(API_ENDPOINTS.PURCHASE_BILL_BY_ID(id), billData, {
        headers: getAuthHeaders(),
      });
      alert("Purchase Bill updated successfully!");
      navigate("/dashboard/purchasebill");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update purchase bill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/purchasebill");
  };

  const vendorOptions = vendors.map(vendor => ({
    value: vendor._id,
    label: vendor.name
  }));

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading purchase bill..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Purchase Bill</h1>
              <p className="mt-2 text-gray-600">Update purchase bill information and details</p>
            </div>
            <Button
              variant="outline"
              onClick={handleCancel}
              icon={<FaTimes />}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FaFileInvoice className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Bill Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Bill Number"
                  name="billNumber"
                  value={billData.billNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter bill number"
                  error={errors.billNumber}
                />

                <Select
                  label="Vendor"
                  name="vendor"
                  value={billData.vendor}
                  onChange={handleChange}
                  options={vendorOptions}
                  placeholder="Select vendor"
                  error={errors.vendor}
                />

                <Input
                  label="Bill Date"
                  name="billDate"
                  type="date"
                  value={billData.billDate?.substring(0, 10)}
                  onChange={handleChange}
                  error={errors.billDate}
                />

                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={billData.dueDate?.substring(0, 10)}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FaBuilding className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Items</h2>
                </div>
                <Button
                  variant="outline"
                  onClick={addItem}
                  icon={<FaPlus />}
                  size="sm"
                >
                  Add Item
                </Button>
              </div>
              
              {errors.items && (
                <Alert type="error" className="mb-4">
                  {errors.items}
                </Alert>
              )}
              
              {billData.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click "Add Item" to start.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax %</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billData.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.itemName || ""}
                              onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Item name"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.rate || ""}
                              onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.taxRate || ""}
                              onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">
                              ₹{item.amount?.toFixed(2) || "0.00"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeItem(idx)}
                              icon={<FaTrash />}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totals Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Totals</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input
                  label="Discount"
                  name="discount"
                  type="number"
                  value={billData.discount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />

                <Input
                  label="Round Off"
                  name="roundOff"
                  type="number"
                  value={billData.roundOff}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                  <input
                    type="number"
                    value={billData.subTotal}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="number"
                    value={billData.totalAmount}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-bold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                icon={<FaSave />}
              >
                {submitting ? 'Updating...' : 'Update Purchase Bill'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default PurchaseBillEdit;
