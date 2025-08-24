import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdAdd } from 'react-icons/md';
import { DetailsPanel } from '../common';
import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

const PurchaseBillForm = () => {
  const { register, handleSubmit, getValues, reset, watch, setValue } = useForm();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorPanel, setShowVendorPanel] = useState(false);
  const [nextBillNumber, setNextBillNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemAdded, setItemAdded] = useState(false);
  const navigate = useNavigate();

  // Fetch vendors and next bill number on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vendors
        const vendorsRes = await axios.get(API_ENDPOINTS.VENDORS, {
          headers: getAuthHeaders(),
        });
        setVendors(vendorsRes.data);
        
        // Fetch next bill number
        try {
          const nextNumberRes = await axios.get(API_ENDPOINTS.PURCHASE_BILL_NEXT_NUMBER, {
            headers: getAuthHeaders(),
          });
          
          const newBillNumber = nextNumberRes.data.nextBillNumber;
          setNextBillNumber(newBillNumber);
          setValue('billNumber', newBillNumber);
        } catch (error) {
          console.error('Error fetching next bill number:', error);
          // Fallback to current year format
          const currentYear = new Date().getFullYear().toString().slice(-2);
          const fallbackNumber = `PB-${currentYear}-001`;
          setNextBillNumber(fallbackNumber);
          setValue('billNumber', fallbackNumber);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setValue]);

  const handleAddItem = () => {
    const { itemName, quantity, unitPrice, taxRate } = getValues();

    if (!itemName || !quantity || !unitPrice) {
      alert('Please fill all required item fields');
      return;
    }

    // Validate numeric values
    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    const tax = parseFloat(taxRate || 0);

    if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
      alert('Please enter valid numeric values for quantity and unit price');
      return;
    }

    const amount = qty * price;
    const taxAmount = (amount * tax) / 100;
    const total = amount + taxAmount;
    
    const newItem = { 
      itemName, 
      description: itemName,
      quantity: qty, 
      rate: price, 
      discount: 0,
      discountType: 'percentage',
      amount: Number(amount.toFixed(2)),
      taxRate: tax,
      taxAmount: Number(taxAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
      hsnCode: '',
      unit: 'Nos',
      receivedQuantity: 0,
      status: 'pending'
    };

    setItems([...items, newItem]);
    setTotalAmount((prev) => prev + total);
    
    // Only reset the item fields, not the entire form
    setValue('itemName', '');
    setValue('quantity', '');
    setValue('unitPrice', '');
    setValue('taxRate', '');
    
    // Show success feedback
    setItemAdded(true);
    setTimeout(() => setItemAdded(false), 1000);
  };

  const removeItem = (index) => {
    const itemToRemove = items[index];
    setItems(items.filter((_, i) => i !== index));
    setTotalAmount((prev) => prev - itemToRemove.total);
  };

  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    const vendor = vendors.find(v => v._id === vendorId);
    setSelectedVendor(vendor);
    setShowVendorPanel(!!vendor);
    
    // Reset vendor panel if no vendor selected
    if (!vendorId) {
      setSelectedVendor(null);
      setShowVendorPanel(false);
    }
  };

  const onSubmit = async (data) => {
    // Validate that at least one item is added
    if (items.length === 0) {
      alert('Please add at least one item to the bill');
      return;
    }

    try {
      const billData = {
        billNumber: data.billNumber,
        vendor: data.vendor,
        billDate: data.billDate,
        dueDate: data.dueDate,
        items,
        totalAmount,
        subTotal: totalAmount,
        notes: data.notes,
      };

      const response = await axios.post(API_ENDPOINTS.PURCHASE_BILL_CREATE, billData, {
        headers: getAuthHeaders(),
      });

      alert('Purchase Bill Created Successfully!');
      navigate('/dashboard/purchasebill');
      
    } catch (error) {
      console.error('Error creating purchase bill:', error);
      alert(`Error creating purchase bill: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase bill form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Main Form */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Create Purchase Bill</h2>
              <p className="text-orange-100 mt-1">Create a new purchase bill for your vendors</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Bill Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill Number *</label>
                    <input
                      type="text"
                      {...register('billNumber', { required: true })}
                      placeholder="PB-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                    <div className="flex space-x-2">
                      <select 
                        {...register('vendor', { required: true })} 
                        onChange={handleVendorChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map((vendor) => (
                          <option key={vendor._id} value={vendor._id}>
                            {vendor.name}
                          </option>
                        ))}
                      </select>
                      {selectedVendor && (
                        <button
                          type="button"
                          onClick={() => setShowVendorPanel(!showVendorPanel)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title={showVendorPanel ? "Hide vendor details" : "Show vendor details"}
                        >
                          {showVendorPanel ? "Hide" : "Details"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date *</label>
                    <input 
                      type="date" 
                      {...register('billDate', { required: true })} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input 
                      type="date" 
                      {...register('dueDate')} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Bill Items
                  </h3>
                </div>

                {/* Add Item Form */}
                <div className="bg-white rounded-lg p-4 mb-6 border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                      <input
                        {...register('itemName')}
                        placeholder="Enter item name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        {...register('quantity')}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('unitPrice')}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('taxRate')}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                        itemAdded 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <MdAdd className="mr-2" />
                      {itemAdded ? 'Item Added!' : 'Add Item'}
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="bg-white rounded-lg overflow-hidden border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.rate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.taxRate}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.total}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <MdDelete className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Bill Summary
                </h3>
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                    <span className="text-lg font-medium text-gray-900">₹{(totalAmount / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Tax Amount:</span>
                    <span className="text-lg font-medium text-gray-900">₹{(totalAmount - (totalAmount / 1.18)).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-700">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Additional Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    {...register('notes')}
                    placeholder="Any additional notes about this purchase bill..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/purchasebill')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                >
                  Create Purchase Bill
                </button>
              </div>
            </form>
          </div>
          
                  {/* Vendor Details Panel */}
        <DetailsPanel
          isOpen={showVendorPanel}
          onClose={() => setShowVendorPanel(false)}
          data={selectedVendor}
          type="vendor"
        />
        </div>
      </div>
    </div>
  );
};

export default PurchaseBillForm;
