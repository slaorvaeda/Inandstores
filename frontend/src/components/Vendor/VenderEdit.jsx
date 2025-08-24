import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaSave, FaTimes, FaFileInvoice } from 'react-icons/fa';
import { Button, Input, Textarea, Card, LoadingSpinner, Alert } from '../common';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [vendor, setVendor] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    notes: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ENDPOINTS.VENDOR_BY_ID(id), {
          headers: getAuthHeaders(),
        });
        setVendor(res.data);
      } catch (error) {
        console.error("Error fetching vendor:", error.response?.data?.message || error.message);
        alert("Failed to load vendor data. Please try again.");
        navigate("/dashboard/vendor");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!vendor.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }
    
    if (vendor.email && !/\S+@\S+\.\S+/.test(vendor.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (vendor.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(vendor.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (vendor.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(vendor.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST number';
    }
    
    if (vendor.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(vendor.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert GST and PAN to uppercase
    let processedValue = value;
    if (name === 'gstNumber' || name === 'panNumber') {
      processedValue = value.toUpperCase();
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setVendor((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.put(API_ENDPOINTS.VENDOR_BY_ID(id), vendor, {
        headers: getAuthHeaders(),
      });
      alert("Vendor updated successfully!");
      navigate("/dashboard/vendor");
    } catch (error) {
      console.error("Error updating vendor:", error.response?.data?.message || error.message);
      alert("Failed to update vendor. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/vendor");
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading vendor..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
              <p className="mt-2 text-gray-600">Update vendor information and details</p>
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
                  label="Vendor Name"
                  name="name"
                  value={vendor.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter vendor name"
                  error={errors.name}
                />

                <Input
                  label="Company"
                  name="company"
                  value={vendor.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={vendor.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={vendor.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Textarea
                    label="Address"
                    name="address"
                    value={vendor.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={vendor.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

                <Input
                  label="State"
                  name="state"
                  value={vendor.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={vendor.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>

            {/* Business Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FaFileInvoice className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="GST Number"
                  name="gstNumber"
                  value={vendor.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  error={errors.gstNumber}
                />

                <Input
                  label="PAN Number"
                  name="panNumber"
                  value={vendor.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  error={errors.panNumber}
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <FaEnvelope className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>
              
              <div>
                <Textarea
                  label="Notes"
                  name="notes"
                  value={vendor.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about this vendor..."
                  rows={4}
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
                loading={submitting}
                icon={<FaSave />}
              >
                {submitting ? 'Updating...' : 'Update Vendor'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VendorEdit;
