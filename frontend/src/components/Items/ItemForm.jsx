import React, { useState } from 'react';
import axios from 'axios';

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
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err.message);
      alert('Error creating item. Check the console for details.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">Create Item Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">HSN Code</label>
          <input
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Preference</label>
          <select
            name="taxPreference"
            value={formData.taxPreference}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Taxable">Taxable</option>
            <option value="Non-Taxable">Non-Taxable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2">
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`item-image-${idx}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-700">Sales Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling Price (INR)</label>
            <input
              name="sellingPrice"
              value={formData.salesInfo.sellingPrice}
              onChange={(e) => handleChange(e, 'salesInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account</label>
            <input
              name="account"
              value={formData.salesInfo.account}
              onChange={(e) => handleChange(e, 'salesInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              name="description"
              value={formData.salesInfo.description}
              onChange={(e) => handleChange(e, 'salesInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Intra State Tax Rate</label>
            <input
              name="intraTaxRate"
              value={formData.salesInfo.intraTaxRate}
              onChange={(e) => handleChange(e, 'salesInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Inter State Tax Rate</label>
            <input
              name="interTaxRate"
              value={formData.salesInfo.interTaxRate}
              onChange={(e) => handleChange(e, 'salesInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-700">Purchase Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Price (INR)</label>
            <input
              name="costPrice"
              value={formData.purchaseInfo.costPrice}
              onChange={(e) => handleChange(e, 'purchaseInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account</label>
            <input
              name="account"
              value={formData.purchaseInfo.account}
              onChange={(e) => handleChange(e, 'purchaseInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              name="description"
              value={formData.purchaseInfo.description}
              onChange={(e) => handleChange(e, 'purchaseInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Vendor</label>
            <input
              name="preferredVendor"
              value={formData.purchaseInfo.preferredVendor}
              onChange={(e) => handleChange(e, 'purchaseInfo')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Create Item
      </button>
    </form>
  );
};

export default ItemForm;
