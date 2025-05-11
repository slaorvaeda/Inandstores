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
      // console.log(response.data);
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>GST Number:</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Billing Address:</label>
          <input
            type="text"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping Address:</label>
          <input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>GST Treatment:</label>
          <select
            name="gstTreatment"
            value={formData.gstTreatment}
            onChange={handleChange}
          >
            <option value="Unregistered Business">Unregistered Business</option>
            <option value="Registered Business">Registered Business</option>
            <option value="Consumer">Consumer</option>
            <option value="Overseas">Overseas</option>
          </select>
        </div>
        <div>
          <label>Place of Supply:</label>
          <input
            type="text"
            name="placeOfSupply"
            value={formData.placeOfSupply}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Email:</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact Phone:</label>
          <input
            type="text"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Client'}
        </button>
      </form>
    </div>
  );
};

export default ClientAdd;
