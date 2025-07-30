import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCamera, FaSave, FaSpinner } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:4000/user/${userId}`);
        setUser(res.data);
        setFormData({ 
          name: res.data.name || '', 
          email: res.data.email || '',
          password: '', 
          avatar: res.data.avatar || '' 
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setErrors({ fetch: 'Failed to load user profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const userId = localStorage.getItem('userId');
      
      // Only send fields that have values
      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      if (formData.avatar) updateData.avatar = formData.avatar;
      
      const res = await axios.put(`http://localhost:4000/user/update/${userId}`, updateData);
      setUser(res.data);
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      setErrors({ update: 'Failed to update profile. Please try again.' });
    } finally {
      setUpdating(false);
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <FaUser className="text-2xl" />
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          <p className="text-blue-100 mt-1">Manage your account information and preferences</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={user?.avatar || 'https://via.placeholder.com/150'} 
                  alt="Profile Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <FaCamera className="text-sm" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{user?.name || 'User'}</h3>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
            
            {errors.update && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {errors.update}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
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

              {/* Email Field */}
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
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
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

              {/* Avatar URL Field */}
              <div>
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

              {/* Submit Button */}
              <div className="pt-4">
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
  );
};

export default UserProfile;
