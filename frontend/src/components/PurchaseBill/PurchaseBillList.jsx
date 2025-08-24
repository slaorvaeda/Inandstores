import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaFileInvoice, FaRupeeSign, FaCalendarAlt, FaTruck } from 'react-icons/fa';
import { Button, Card, LoadingSpinner, Alert } from '../common';
import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

function PurchaseBillList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(API_ENDPOINTS.PURCHASE_BILLS, {
          headers: getAuthHeaders(),
        });
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setError(`Failed to load purchase bills: ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.PURCHASE_BILL_BY_ID(id), {
        headers: getAuthHeaders(),
      });

      // Remove the deleted bill from UI
      setBills(bills.filter(bill => bill._id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete bill.");
    }
  };

  // Calculate stats
  const totalAmountSum = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const totalBills = bills.length;
  const thisMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.billDate);
    const now = new Date();
    return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading purchase bills..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Bills</h1>
              <p className="mt-2 text-gray-600">Manage your purchase bill records</p>
            </div>
            <Button
              onClick={() => navigate("add")}
              icon={<span className="mr-2">+</span>}
            >
              Add New Bill
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
                <FaFileInvoice className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">{totalBills}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaRupeeSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmountSum.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{thisMonthBills}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bills Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Purchase Bills</h3>
          </div>
          
          {bills.length === 0 ? (
            <div className="p-8 text-center">
              <FaTruck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase bills found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new purchase bill.</p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("add")}
                  icon={<span className="mr-2">+</span>}
                >
                  Add New Bill
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{bill.billNumber}
                          </div>
                          {bill.reference && (
                            <div className="text-sm text-gray-500">
                              Ref: {bill.reference}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bill.vendor?.name || 'N/A'}
                        </div>
                        {bill.vendor?.email && (
                          <div className="text-sm text-gray-500">
                            {bill.vendor.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{bill.totalAmount?.toFixed(2) || '0.00'}
                        </div>
                        {bill.items?.length && (
                          <div className="text-sm text-gray-500">
                            {bill.items.length} items
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.billDate ? new Date(bill.billDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/dashboard/purchasebill/${bill._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="View Bill"
                          >
                            <GrView className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/dashboard/purchasebill/edit/${bill._id}`}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Edit Bill"
                          >
                            <CiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(bill._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Delete Bill"
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
}

export default PurchaseBillList;
