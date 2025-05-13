import React, { useState } from 'react';
import axios from 'axios';

const ClientAdd = () => {
  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    billingAddress: '',
    shippingAddress: '',
    gstTreatment: 'Unregistered Business',
    placeOfSupply: '',
    contact: {
      email: '',
      phone: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('contact.')) {
      const contactField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // if using auth
      const response = await axios.post(
        'http://localhost:4000/api/clients',
        formData,
        token ? { headers: { Authorization: token } } : {}
      );

      alert('Client created successfully!');
      // Reset form
      setFormData({
        name: '',
        gstNumber: '',
        billingAddress: '',
        shippingAddress: '',
        gstTreatment: 'Unregistered Business',
        placeOfSupply: '',
        contact: {
          email: '',
          phone: '',
        },
      });
    } catch (error) {
      console.error('Error creating client:', error.response?.data || error.message);
      alert('Failed to create client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GST Number:</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Billing Address:</label>
          <input
            type="text"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shipping Address:</label>
          <input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GST Treatment:</label>
          <select
            name="gstTreatment"
            value={formData.gstTreatment}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Unregistered Business">Unregistered Business</option>
            <option value="Registered Business">Registered Business</option>
            <option value="Consumer">Consumer</option>
            <option value="Overseas">Overseas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Place of Supply:</label>
          <input
            type="text"
            name="placeOfSupply"
            value={formData.placeOfSupply}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email:</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Phone:</label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-medium rounded-md ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Create Client'}
        </button>
      </form>
    </div>
  );
};

export default ClientAdd;