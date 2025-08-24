import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaSave, FaTimes } from 'react-icons/fa';
import { Button, Input, Textarea, Select, Card, LoadingSpinner } from '../common';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const ClientAdd = () => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});

  const gstTreatmentOptions = [
    { value: 'Unregistered Business', label: 'Unregistered Business' },
    { value: 'Registered Business', label: 'Registered Business' },
    { value: 'Consumer', label: 'Consumer' },
    { value: 'Overseas', label: 'Overseas' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }
    
    if (formData.contact.email && !/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.contact.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.contact.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert GST to uppercase
    let processedValue = value;
    if (name === 'gstNumber') {
      processedValue = value.toUpperCase();
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name.includes('contact.')) {
      const contactField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: processedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.CLIENTS,
        formData
      );

      alert('Client created successfully!');
      navigate('/dashboard/client');
    } catch (error) {
      console.error('Error creating client:', error.response?.data || error.message);
      alert('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/client');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
              <p className="mt-2 text-gray-600">Create a new client record with complete information</p>
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
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Client Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter client name"
                  error={errors.name}
                />

                <Input
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  error={errors.gstNumber}
                />

                <Select
                  label="GST Treatment"
                  name="gstTreatment"
                  value={formData.gstTreatment}
                  onChange={handleChange}
                  options={gstTreatmentOptions}
                />

                <Input
                  label="Place of Supply"
                  name="placeOfSupply"
                  value={formData.placeOfSupply}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra, India"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaEnvelope className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  name="contact.email"
                  type="email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Textarea
                  label="Billing Address"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  placeholder="Enter complete billing address"
                  rows={3}
                />

                <Textarea
                  label="Shipping Address"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Enter complete shipping address"
                  rows={3}
                />
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
                loading={loading}
                icon={<FaSave />}
              >
                {loading ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ClientAdd;