import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UIButton, UICard, UIInput, UITable, UIBadge, UIModal } from '../../../components/ui/index.js';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { FaPlus, FaEdit, FaArrowLeft, FaUser, FaBuilding, FaMoneyBillWave, FaChartLine, FaHistory, FaTrash, FaUndo, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders } from '../../../config/api';

const KhataDetail = () => {
  const { khataId } = useParams();
  const navigate = useNavigate();
  const [khata, setKhata] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeletedEntries, setShowDeletedEntries] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKhata();
    fetchEntries();
  }, [khataId]);

  useEffect(() => {
    fetchEntries();
  }, [showDeletedEntries]);

  const fetchKhata = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_ENDPOINTS.KHATA}/${khataId}`, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      
      if (data.success) {
        const khataData = {
          ...data.data.khata,
          currentBalance: parseFloat(data.data.khata.currentBalance) || 0,
          totalCredit: parseFloat(data.data.khata.totalCredit) || 0,
          totalDebit: parseFloat(data.data.khata.totalDebit) || 0
        };
        
        setKhata(khataData);
        setEntries(data.data.entries);
      }
    } catch (error) {
      console.error('Error fetching khata:', error);
      setError('Failed to load khata details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.KHATA}/${khataId}/entries?includeDeleted=${showDeletedEntries}`, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      
      if (data.success) {
        const cleanEntries = data.data.map(entry => ({
          ...entry,
          amount: parseFloat(entry.amount) || 0,
          balanceAfter: parseFloat(entry.balanceAfter) || 0
        }));
        
        setEntries(cleanEntries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const getBalanceColor = (balance) => {
    if (balance === 0) return 'text-green-600 bg-green-50';
    if (balance > 0) return 'text-red-600 bg-red-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getEntryTypeColor = (type) => {
    return type === 'credit' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50';
  };

  const getLedgerTypeIcon = (type) => {
    return type === 'client' ? <FaUser className="w-5 h-5" /> : <FaBuilding className="w-5 h-5" />;
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_ENDPOINTS.KHATA}/${khataId}/entries/${entryId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        fetchEntries();
        fetchKhata(); // Refresh khata to update balance
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleRestoreEntry = async (entryId) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.KHATA}/${khataId}/entries/${entryId}/restore`, {}, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        fetchEntries();
        fetchKhata(); // Refresh khata to update balance
      }
    } catch (error) {
      console.error('Error restoring entry:', error);
    }
  };

  const columns = [
    {
      key: 'transactionDate',
      label: 'Date',
      className: 'hidden sm:table-cell',
      render: (value) => (
        <div className="text-xs sm:text-sm font-medium text-gray-900">
          {formatDate(value)}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getEntryTypeColor(value)}`}>
          {value === 'credit' ? 'Credit' : 'Debit'}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <div className="font-medium text-gray-900 text-sm">
          {formatCurrency(value, 'INR')}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      className: 'hidden md:table-cell',
      render: (value) => (
        <div className="text-xs sm:text-sm text-gray-700 truncate max-w-32">
          {value || 'No description'}
        </div>
      )
    },
    {
      key: 'balanceAfter',
      label: 'Balance',
      className: 'hidden lg:table-cell',
      render: (value) => (
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getBalanceColor(value)}`}>
          {formatCurrency(value, 'INR')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-1 sm:space-x-2">
          {row.isDeleted ? (
            <UIButton
              size="sm"
              variant="outline"
              onClick={() => handleRestoreEntry(row._id)}
              className="text-green-600 hover:bg-green-50 p-1 sm:p-2"
            >
              <FaUndo className="w-3 h-3" />
            </UIButton>
          ) : (
            <UIButton
              size="sm"
              variant="outline"
              onClick={() => handleDeleteEntry(row._id)}
              className="text-red-600 hover:bg-red-50 p-1 sm:p-2"
            >
              <FaTrash className="w-3 h-3" />
            </UIButton>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading khata details...</p>
        </div>
      </div>
    );
  }

  if (!khata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Khata not found</p>
          <UIButton onClick={() => navigate('/dashboard/khata')} className="mt-4">
            <FaArrowLeft className="mr-2" />
            Back to Khatas
          </UIButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard/khata')}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm sm:text-base"
              >
                <FaArrowLeft className="mr-2" />
                <span className="hidden sm:inline">Back to Khatas</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{khata.personName}</h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Khata Details</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <FaEdit className="mr-2" />
                <span className="hidden sm:inline">Edit</span>
                <span className="sm:hidden">Edit Khata</span>
              </button>
              <button
                onClick={() => setShowAddEntryModal(true)}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                <span className="hidden sm:inline">Add Entry</span>
                <span className="sm:hidden">Add Transaction</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaMoneyBillWave className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(khata.currentBalance, 'INR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaRupeeSign className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Credit</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(khata.totalCredit, 'INR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Debit</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(khata.totalDebit, 'INR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Khata Info and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Khata Info */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Khata Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className={`p-1 sm:p-2 rounded-full ${khata.ledgerType === 'client' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {getLedgerTypeIcon(khata.ledgerType)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{khata.personName}</p>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{khata.ledgerType} ledger</p>
                </div>
              </div>
              
              {khata.phone && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <span className="text-xs sm:text-sm text-gray-600">Phone:</span>
                  <span className="text-xs sm:text-sm font-medium">{khata.phone}</span>
                </div>
              )}
              {khata.address && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <span className="text-xs sm:text-sm text-gray-600">Address:</span>
                  <span className="text-xs sm:text-sm font-medium">{khata.address}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                <UIBadge color={khata.status === 'active' ? 'green' : 'gray'} className="text-xs">
                  {khata.status}
                </UIBadge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => setShowAddEntryModal(true)}
                className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center text-sm sm:text-base"
              >
                <FaPlus className="mr-2" />
                Add Transaction
              </button>
              
              <button
                onClick={() => setShowDeletedEntries(!showDeletedEntries)}
                className="w-full bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center text-sm sm:text-base"
              >
                <FaHistory className="mr-2" />
                {showDeletedEntries ? 'Hide Deleted' : 'Show Deleted'}
              </button>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Transaction Summary</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-xs sm:text-sm text-gray-600">Total Transactions:</span>
                <span className="text-xs sm:text-sm font-medium">{entries.length}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-xs sm:text-sm text-gray-600">Last Updated:</span>
                <span className="text-xs sm:text-sm font-medium">{formatDate(khata.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Transaction History</h3>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTrash className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="p-4 sm:p-8 text-center">
              <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new transaction.</p>
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => setShowAddEntryModal(true)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" />
                  Add Transaction
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <UITable
                columns={columns}
                data={entries}
                loading={loading}
                emptyMessage="No transactions found"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      <UIModal
        isOpen={showAddEntryModal}
        onClose={() => setShowAddEntryModal(false)}
        title="Add New Transaction"
        size="lg"
      >
        <AddEntryForm
          khataId={khataId}
          onSuccess={() => {
            setShowAddEntryModal(false);
            fetchEntries();
            fetchKhata();
          }}
          onError={(error) => setError(error)}
        />
      </UIModal>

      {/* Edit Khata Modal */}
      <UIModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Khata"
        size="lg"
      >
        <EditKhataForm
          khata={khata}
          onSuccess={() => {
            setShowEditModal(false);
            fetchKhata();
          }}
          onError={(error) => setError(error)}
        />
      </UIModal>
    </div>
  );
};

// Add Entry Form Component
const AddEntryForm = ({ khataId, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    type: 'credit',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      onError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_ENDPOINTS.KHATA}/${khataId}/entries`, formData, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        onSuccess();
      } else {
        onError(response.data.message || 'Error adding entry');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      const errorMessage = error.response?.data?.message || 'Error adding entry';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Transaction Type */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type *</label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'credit'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'credit' }))}
            >
              <div className="text-center">
                <div className="font-medium text-red-600 text-sm sm:text-base">Credit</div>
                <div className="text-xs sm:text-sm text-gray-500">Money given</div>
              </div>
            </div>
            
            <div
              className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'debit'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'debit' }))}
            >
              <div className="text-center">
                <div className="font-medium text-green-600 text-sm sm:text-base">Debit</div>
                <div className="text-xs sm:text-sm text-gray-500">Money received</div>
              </div>
            </div>
          </div>
        </div>

        <UIInput
          label="Amount *"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          required
          placeholder="Enter amount"
        />

        <UIInput
          label="Transaction Date"
          type="date"
          value={formData.transactionDate}
          onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
        />

        <div className="md:col-span-2">
          <UIInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter transaction description"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
        <UIButton
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
        >
          Cancel
        </UIButton>
        <UIButton
          type="submit"
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Transaction
        </UIButton>
      </div>
    </form>
  );
};

// Edit Khata Form Component
const EditKhataForm = ({ khata, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    personName: khata.personName || '',
    phone: khata.phone || '',
    address: khata.address || '',
    notes: khata.notes || '',
    status: khata.status || 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.personName.trim()) {
      onError('Please enter a person name');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`${API_ENDPOINTS.KHATA}/${khata._id}`, formData, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        onSuccess();
      } else {
        onError(response.data.message || 'Error updating khata');
      }
    } catch (error) {
      console.error('Error updating khata:', error);
      const errorMessage = error.response?.data?.message || 'Error updating khata';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <UIInput
          label="Person Name *"
          value={formData.personName}
          onChange={(e) => setFormData(prev => ({ ...prev, personName: e.target.value }))}
          required
          placeholder="Enter person's name"
        />

        <UIInput
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Enter phone number"
        />

        <div className="md:col-span-2">
          <UIInput
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter address"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
        <UIButton
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
        >
          Cancel
        </UIButton>
        <UIButton
          type="submit"
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Update Khata
        </UIButton>
      </div>
    </form>
  );
};

export default KhataDetail;
