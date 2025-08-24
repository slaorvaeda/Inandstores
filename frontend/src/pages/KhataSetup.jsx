import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UIButton, UICard, UIInput } from '../components/ui/index.js';
import { FaBook, FaUser, FaStore } from 'react-icons/fa';

const KhataSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store setup data in localStorage
      localStorage.setItem('khataSetup', JSON.stringify(formData));
      
      // Navigate to khata dashboard
      navigate('/dashboard/khata');
    } catch (error) {
      console.error('Setup error:', error);
      alert('Error during setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate directly to khata dashboard
    navigate('/dashboard/khata');
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaBook className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Khata Book
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Simple digital ledger for your business
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <UICard>
          <UICard.Body>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaStore className="inline mr-2" />
                  Business Name
                </label>
                <UIInput
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Owner Name
                </label>
                <UIInput
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Enter owner name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <UIInput
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter business address"
                />
              </div>

              <div className="flex space-x-3">
                <UIButton
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip Setup
                </UIButton>
                <UIButton
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  Start Using Khata
                </UIButton>
              </div>
            </form>
          </UICard.Body>
        </UICard>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Your data is stored locally on your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default KhataSetup;
