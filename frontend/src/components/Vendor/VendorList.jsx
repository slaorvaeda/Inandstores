import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaUsers, FaRupeeSign, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { Button, Card, LoadingSpinner, Alert } from '../common';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_ENDPOINTS.VENDORS, {
        headers: getAuthHeaders(),
      });
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error.response?.data?.message || error.message);
      setError("Failed to load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await axios.delete(API_ENDPOINTS.VENDOR_BY_ID(id), {
        headers: getAuthHeaders(),
      });
      setVendors(vendors.filter((vendor) => vendor._id !== id));
    } catch (error) {
      console.error("Error deleting vendor:", error.response?.data?.message || error.message);
      alert("Failed to delete vendor. Please try again.");
    }
  };

  // Calculate stats
  const totalVendors = vendors.length;
  const totalPurchases = vendors.reduce((sum, vendor) => sum + (vendor.purchaseCount || 0), 0);
  const totalSpent = vendors.reduce((sum, vendor) => sum + (vendor.totalSpent || 0), 0);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading vendors..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
              <p className="mt-2 text-gray-600">Manage your vendor records and relationships</p>
            </div>
            <Button
              onClick={() => navigate("add")}
              icon={<span className="mr-2">+</span>}
            >
              Add New Vendor
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" className="mb-6" dismissible>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaRupeeSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vendors Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Vendors</h3>
          </div>
          
          {vendors.length === 0 ? (
            <div className="p-8 text-center">
              <FaBuilding className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new vendor.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("add")}
                  icon={<span className="mr-2">+</span>}
                >
                  Add New Vendor
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Info
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.name}
                          </div>
                          {vendor.company && (
                            <div className="text-sm text-gray-500">
                              {vendor.company}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.email || 'N/A'}
                        </div>
                        {vendor.phone && (
                          <div className="text-sm text-gray-500">
                            {vendor.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {vendor.address || 'N/A'}
                        </div>
                        {vendor.city && (
                          <div className="text-sm text-gray-500">
                            {vendor.city}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vendor.gstNumber || 'N/A'}
                        </div>
                        {vendor.panNumber && (
                          <div className="text-sm text-gray-500">
                            PAN: {vendor.panNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`view/${vendor._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="View Vendor"
                          >
                            <GrView className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`edit/${vendor._id}`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Edit Vendor"
                          >
                            <CiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vendor._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Delete Vendor"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VendorList;
