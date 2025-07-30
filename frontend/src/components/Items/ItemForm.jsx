import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
    const userId = localStorage.getItem("userId") || '';
  const [formData, setFormData] = useState({
    userId,
    name: '',
    sku: '',
    unit: '',
    hsnCode: '',
    taxPreference: 'Taxable',
    images: [],
    stockQuantity: 0,
    reorderLevel: 10,
    reorderQuantity: 50,
    salesInfo: {
      sellingPrice: '',
      account: '',
      description: '',
      intraTaxRate: 'GST18',
      interTaxRate: 'IGST18',
    },
    purchaseInfo: {
      costPrice: '',
      account: '',
      description: '',
      preferredVendor: '',
    },
  });

  

  const [imageFiles, setImageFiles] = useState([]); // Store actual image files
  const navigate = useNavigate();

  const handleChange = (e, section, field) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field || name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files); // Store files for upload
    const urls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: urls })); // For preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("User ID:", userId);
  
    try {
      const payload = {
        ...formData,
        userId, // explicitly ensure it's included
      };
  
      await axios.post('http://localhost:4000/api/items', payload);
      alert('Item created successfully!');
      navigate('/dashboard/item/list');
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err.message);
      alert('Error creating item. Check the console for details.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Create New Item</h2>
            <p className="text-green-100 mt-1">Add a new item to your inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Stock Keeping Unit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g., pieces, kg, liters"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code</label>
                  <input
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    placeholder="Harmonized System Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Preference</label>
                  <select
                    name="taxPreference"
                    value={formData.taxPreference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Taxable">Taxable</option>
                    <option value="Non-Taxable">Non-Taxable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formData.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`item-image-${idx}`}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Stock Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    min="0"
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Quantity</label>
                  <input
                    type="number"
                    name="reorderQuantity"
                    value={formData.reorderQuantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Sales Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Sales Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹)</label>
                  <input
                    name="sellingPrice"
                    value={formData.salesInfo.sellingPrice}
                    onChange={(e) => handleChange(e, 'salesInfo', 'sellingPrice')}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales Account</label>
                  <input
                    name="account"
                    value={formData.salesInfo.account}
                    onChange={(e) => handleChange(e, 'salesInfo', 'account')}
                    placeholder="Sales account"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intra-State Tax Rate</label>
                  <select
                    name="intraTaxRate"
                    value={formData.salesInfo.intraTaxRate}
                    onChange={(e) => handleChange(e, 'salesInfo', 'intraTaxRate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="GST5">GST 5%</option>
                    <option value="GST12">GST 12%</option>
                    <option value="GST18">GST 18%</option>
                    <option value="GST28">GST 28%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inter-State Tax Rate</label>
                  <select
                    name="interTaxRate"
                    value={formData.salesInfo.interTaxRate}
                    onChange={(e) => handleChange(e, 'salesInfo', 'interTaxRate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="IGST5">IGST 5%</option>
                    <option value="IGST12">IGST 12%</option>
                    <option value="IGST18">IGST 18%</option>
                    <option value="IGST28">IGST 28%</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales Description</label>
                  <textarea
                    name="description"
                    value={formData.salesInfo.description}
                    onChange={(e) => handleChange(e, 'salesInfo', 'description')}
                    placeholder="Sales description..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Purchase Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price (₹)</label>
                  <input
                    name="costPrice"
                    value={formData.purchaseInfo.costPrice}
                    onChange={(e) => handleChange(e, 'purchaseInfo', 'costPrice')}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Account</label>
                  <input
                    name="account"
                    value={formData.purchaseInfo.account}
                    onChange={(e) => handleChange(e, 'purchaseInfo', 'account')}
                    placeholder="Purchase account"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Vendor</label>
                  <input
                    name="preferredVendor"
                    value={formData.purchaseInfo.preferredVendor}
                    onChange={(e) => handleChange(e, 'purchaseInfo', 'preferredVendor')}
                    placeholder="Vendor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Description</label>
                  <textarea
                    name="description"
                    value={formData.purchaseInfo.description}
                    onChange={(e) => handleChange(e, 'purchaseInfo', 'description')}
                    placeholder="Purchase description..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard/item/list')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
