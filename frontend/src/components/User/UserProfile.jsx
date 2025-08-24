import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCamera, FaSave, FaSpinner, FaBuilding, FaMapMarkerAlt, FaUniversity, FaCog } from 'react-icons/fa';
import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    password: '',
    avatar: '',
    phone: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    
    // Address Information
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    
    // Bank Details
    bankDetails: {
      accountNumber: '',
      ifsc: '',
      bankName: '',
      branch: ''
    },
    
    // Business Settings
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    language: 'en'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(API_ENDPOINTS.USER_PROFILE, {
          headers: getAuthHeaders()
        });
        
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          password: '',
          avatar: res.data.avatar || '',
          phone: res.data.phone || '',
          businessName: res.data.businessName || '',
          businessType: res.data.businessType || '',
          gstNumber: res.data.gstNumber || '',
          panNumber: res.data.panNumber || '',
          address: {
            street: res.data.address?.street || '',
            city: res.data.address?.city || '',
            state: res.data.address?.state || '',
            pincode: res.data.address?.pincode || '',
            country: res.data.address?.country || 'India'
          },
          bankDetails: {
            accountNumber: res.data.bankDetails?.accountNumber || '',
            ifsc: res.data.bankDetails?.ifsc || '',
            bankName: res.data.bankDetails?.bankName || '',
            branch: res.data.bankDetails?.branch || ''
          },
          currency: res.data.currency || 'INR',
          timezone: res.data.timezone || 'Asia/Kolkata',
          dateFormat: res.data.dateFormat || 'DD/MM/YYYY',
          language: res.data.language || 'en'
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setErrors({ fetch: 'Failed to load user profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert GST and PAN to uppercase
    let processedValue = value;
    if (name === 'gstNumber' || name === 'panNumber') {
      processedValue = value.toUpperCase();
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.avatar && !formData.avatar.startsWith('http')) {
      newErrors.avatar = 'Please enter a valid URL';
    }
    
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST number format';
    }
    
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN number format';
    }
    
    if (formData.address.pincode && !/^[1-9][0-9]{5}$/.test(formData.address.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const res = await axios.put(API_ENDPOINTS.USER_PROFILE, formData, {
        headers: getAuthHeaders()
      });
      
      setUser(res.data);
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user profile:', err);
      setErrors({ update: 'Failed to update profile. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'business', label: 'Business Details', icon: FaBuilding },
    { id: 'address', label: 'Address', icon: FaMapMarkerAlt },
    { id: 'bank', label: 'Bank Details', icon: FaUniversity },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const businessTypes = [
    'Individual',
    'Partnership', 
    'Private Limited',
    'Public Limited',
    'LLP',
    'Sole Proprietorship'
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const timezones = [
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Minimum 6 characters</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL
                </label>
                <input 
                  type="url" 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.avatar ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatar && (
                  <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Enter a valid image URL</p>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input 
                  type="text" 
                  name="businessName" 
                  value={formData.businessName} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                <input 
                  type="text" 
                  name="gstNumber" 
                  value={formData.gstNumber} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.gstNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="22AAAAA0000A1Z5"
                  style={{ textTransform: 'uppercase' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.gstNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.gstNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number
                </label>
                <input 
                  type="text" 
                  name="panNumber" 
                  value={formData.panNumber} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.panNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ABCDE1234F"
                  style={{ textTransform: 'uppercase' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.panNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.panNumber}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Address Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input 
                  type="text" 
                  name="address.street" 
                  value={formData.address.street} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="123 Business Street, Building Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input 
                  type="text" 
                  name="address.city" 
                  value={formData.address.city} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input 
                  type="text" 
                  name="address.state" 
                  value={formData.address.state} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Maharashtra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <input 
                  type="text" 
                  name="address.pincode" 
                  value={formData.address.pincode} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pincode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="400001"
                />
                {errors.pincode && (
                  <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input 
                  type="text" 
                  name="address.country" 
                  value={formData.address.country} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="India"
                />
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Bank Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input 
                  type="text" 
                  name="bankDetails.accountNumber" 
                  value={formData.bankDetails.accountNumber} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input 
                  type="text" 
                  name="bankDetails.ifsc" 
                  value={formData.bankDetails.ifsc} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="SBIN0001234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input 
                  type="text" 
                  name="bankDetails.bankName" 
                  value={formData.bankDetails.bankName} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="State Bank of India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <input 
                  type="text" 
                  name="bankDetails.branch" 
                  value={formData.bankDetails.branch} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Main Branch"
                />
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Business Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {dateFormats.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-gray-600">
          <FaSpinner className="animate-spin text-xl" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <FaUser className="text-2xl" />
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          <p className="text-blue-100 mt-1">Manage your account information and business details</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={user?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='85' font-family='Arial' font-size='60' text-anchor='middle' fill='%236b7280'%3E👤%3C/text%3E%3C/svg%3E"} 
                  alt="Profile Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <FaCamera className="text-sm" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{user?.name || 'User'}</h3>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
              {user?.businessName && (
                <p className="text-sm text-gray-500 mt-1">{user.businessName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="text-sm" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {errors.update && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                  {errors.update}
                </div>
              )}

              <form onSubmit={handleUpdate}>
                {renderTabContent()}

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
