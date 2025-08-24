import React, { useState, useEffect } from 'react';
import { UIButton, UICard, UIInput, UITable, UIBadge, UIModal } from '../../../components/ui/index.js';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { FaPlus, FaSearch, FaEdit, FaEye, FaFilter, FaTimes, FaUser, FaBuilding, FaChartLine, FaMoneyBillWave, FaUsers, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders } from '../../../config/api';

const KhataList = () => {
  const [khatas, setKhatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateSidebar, setShowCreateSidebar] = useState(false);
  const [showTransactionSidebar, setShowTransactionSidebar] = useState(false);
  const [selectedKhataForTransaction, setSelectedKhataForTransaction] = useState(null);
  const [ledgerType, setLedgerType] = useState('all');
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchKhatas();
    fetchSummary();
  }, [searchTerm, pagination.page, ledgerType]);

  const fetchKhatas = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(ledgerType !== 'all' && { ledgerType })
      });

      const response = await axios.get(`${API_ENDPOINTS.KHATA}?${params}`, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      
      if (data.success) {
        const cleanKhatas = data.data.map(khata => ({
          ...khata,
          currentBalance: parseFloat(khata.currentBalance) || 0,
          totalCredit: parseFloat(khata.totalCredit) || 0,
          totalDebit: parseFloat(khata.totalDebit) || 0
        }));
        
        setKhatas(cleanKhatas);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching khatas:', error);
      setError('Failed to load khatas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.KHATA}/summary`, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      
      if (data.success) {
        const cleanSummary = {
          ...data.data.summary,
          totalKhatas: parseInt(data.data.summary.totalKhatas) || 0,
          activeKhatas: parseInt(data.data.summary.activeKhatas) || 0,
          closedKhatas: parseInt(data.data.summary.closedKhatas) || 0,
          totalOutstanding: parseFloat(data.data.summary.totalOutstanding) || 0,
          totalCredit: parseFloat(data.data.summary.totalCredit) || 0,
          totalDebit: parseFloat(data.data.summary.totalDebit) || 0
        };
        
        setSummary(cleanSummary);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const getBalanceColor = (balance) => {
    if (balance === 0) return 'text-green-600';
    if (balance > 0) return 'text-red-600';
    return 'text-blue-600';
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 
      <UIBadge color="green" className="text-xs">Active</UIBadge> : 
      <UIBadge color="gray" className="text-xs">Closed</UIBadge>;
  };

  const getLedgerTypeIcon = (type) => {
    return type === 'client' ? <FaUser className="w-4 h-4" /> : <FaBuilding className="w-4 h-4" />;
  };

  const handleAddTransactionForKhata = (khata) => {
    setSelectedKhataForTransaction(khata);
    setShowTransactionSidebar(true);
  };

  const columns = [
    {
      key: 'personName',
      label: 'Person Name',
      render: (value, row) => (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`p-1 sm:p-2 rounded-full ${row.ledgerType === 'client' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {getLedgerTypeIcon(row.ledgerType)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{value}</div>
            {row.phone && <div className="text-xs sm:text-sm text-gray-500 truncate">{row.phone}</div>}
            <div className="text-xs text-gray-400 capitalize">{row.ledgerType} ledger</div>
          </div>
        </div>
      )
    },
    {
      key: 'currentBalance',
      label: 'Balance',
      render: (value, row) => (
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getBalanceColor(value)}`}>
          {formatCurrency(value, 'INR')}
        </div>
      )
    },
    {
      key: 'totalCredit',
      label: 'Credit',
      className: 'hidden md:table-cell',
      render: (value) => (
        <div className="text-green-600 font-medium text-sm">
          {formatCurrency(value, 'INR')}
        </div>
      )
    },
    {
      key: 'totalDebit',
      label: 'Debit',
      className: 'hidden md:table-cell',
      render: (value) => (
        <div className="text-blue-600 font-medium text-sm">
          {formatCurrency(value, 'INR')}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      className: 'hidden sm:table-cell',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      className: 'hidden lg:table-cell',
      render: (value) => (
        <div className="text-xs sm:text-sm text-gray-500">
          {formatDate(value)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-1 sm:space-x-2">
          <UIButton
            size="sm"
            variant="outline"
            onClick={() => handleAddTransactionForKhata(row)}
            className="text-green-600 hover:bg-green-50 p-1 sm:p-2"
            title="Add Entry"
          >
            <FaMoneyBillWave className="w-3 h-3" />
          </UIButton>
          <UIButton
            size="sm"
            variant="outline"
            onClick={() => window.location.href = `/dashboard/khata/${row._id}`}
            className="text-blue-600 hover:bg-blue-50 p-1 sm:p-2"
            title="View Details"
          >
            <FaEye className="w-3 h-3" />
          </UIButton>
          <UIButton
            size="sm"
            variant="outline"
            onClick={() => window.location.href = `/dashboard/khata/${row._id}/edit`}
            className="text-purple-600 hover:bg-purple-50 p-1 sm:p-2"
            title="Edit Khata"
          >
            <FaEdit className="w-3 h-3" />
          </UIButton>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading khatas...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-semibold">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Khata Management</h1>
              <p className="mt-2 text-gray-600">Manage your client and vendor ledgers</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowTransactionSidebar(true)}
                className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <FaMoneyBillWave className="mr-2" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add Entry</span>
              </button>
              <button
                onClick={() => setShowCreateSidebar(true)}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <span className="mr-2">+</span>
                <span className="hidden sm:inline">Add New Khata</span>
                <span className="sm:hidden">New Khata</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Ledgers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{summary.totalKhatas || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaRupeeSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Outstanding Amount</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(summary.totalOutstanding || 0, 'INR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Ledgers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{summary.activeKhatas || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Ledger Type Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <label className="text-sm font-medium text-gray-700">Ledger Type:</label>
                <select
                  value={ledgerType}
                  onChange={(e) => setLedgerType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ledgers</option>
                  <option value="client">Client Ledgers</option>
                  <option value="vendor">Vendor Ledgers</option>
                </select>
              </div>
              
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <UIInput
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLedgerType('all');
                }}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Khatas</h3>
          </div>
          
          {khatas.length === 0 ? (
            <div className="p-4 sm:p-8 text-center">
              <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No khatas found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new khata.</p>
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => setShowCreateSidebar(true)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <span className="mr-2">+</span> Add New Khata
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <UITable
                columns={columns}
                data={khatas}
                loading={loading}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Khata Sidebar */}
      <CreateKhataSidebar
        isOpen={showCreateSidebar}
        onClose={() => setShowCreateSidebar(false)}
        ledgerType={ledgerType}
        onSuccess={() => {
          setShowCreateSidebar(false);
          fetchKhatas();
          fetchSummary();
        }}
        onError={(error) => setError(error)}
      />

      {/* Add Transaction Sidebar */}
      <AddTransactionSidebar
        isOpen={showTransactionSidebar}
        onClose={() => {
          setShowTransactionSidebar(false);
          setSelectedKhataForTransaction(null);
        }}
        onSuccess={() => {
          setShowTransactionSidebar(false);
          setSelectedKhataForTransaction(null);
          fetchKhatas();
          fetchSummary();
        }}
        onError={(error) => setError(error)}
        khatas={khatas}
        preSelectedKhata={selectedKhataForTransaction}
      />
    </div>
  );
};

// Create Khata Sidebar Component
const CreateKhataSidebar = ({ isOpen, onClose, onSuccess, onError, ledgerType = 'all' }) => {
  const [formData, setFormData] = useState({
    personName: '',
    phone: '',
    address: '',
    notes: '',
    ledgerType: ledgerType === 'all' ? 'client' : ledgerType
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Fetch clients and vendors when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchVendors();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await axios.get(API_ENDPOINTS.CLIENTS, {
        headers: getAuthHeaders()
      });
      // Handle the response structure: { clients: [...] }
      if (response.data && response.data.clients) {
        setClients(response.data.clients);
      } else if (Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const response = await axios.get(API_ENDPOINTS.VENDORS, {
        headers: getAuthHeaders()
      });
      // Handle the response structure: direct array
      if (Array.isArray(response.data)) {
        setVendors(response.data);
      } else if (response.data && response.data.vendors) {
        setVendors(response.data.vendors);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handlePersonSelect = (person, type) => {
    setSelectedPerson({ ...person, type });
    
    // Handle different data structures from client/vendor models
    const personName = person.name || person.personName || person.clientName || person.vendorName;
    const phone = person.phone || person.contact?.phone || person.mobile || person.contact?.mobile;
    const address = person.address || person.contact?.address || person.location || person.contact?.location;
    
    setFormData({
      personName: personName || '',
      phone: phone || '',
      address: address || '',
      notes: formData.notes,
      ledgerType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.personName.trim()) {
      onError('Please enter a person name');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.KHATA, formData, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      
      if (data.success) {
        onSuccess();
      } else {
        onError(data.message || 'Error creating khata');
      }
    } catch (error) {
      console.error('Error creating khata:', error);
      const errorMessage = error.response?.data?.message || 'Error creating khata';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      personName: '',
      phone: '',
      address: '',
      notes: '',
      ledgerType: ledgerType === 'all' ? 'client' : ledgerType
    });
    setSelectedPerson(null);
  };

  const getAvailablePeople = () => {
    if (formData.ledgerType === 'client') {
      return clients.map(client => ({
        id: client._id,
        name: client.name || client.clientName,
        phone: client.phone || client.contact?.phone || client.mobile || client.contact?.mobile,
        address: client.address || client.contact?.address || client.location || client.contact?.location,
        type: 'client'
      }));
    } else if (formData.ledgerType === 'vendor') {
      return vendors.map(vendor => ({
        id: vendor._id,
        name: vendor.name || vendor.vendorName,
        phone: vendor.phone || vendor.contact?.phone || vendor.mobile || vendor.contact?.mobile,
        address: vendor.address || vendor.contact?.address || vendor.location || vendor.contact?.location,
        type: 'vendor'
      }));
    }
    return [];
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Khata</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ledger Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ledger Type *</label>
                <div className="space-y-3">
                  <div
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.ledgerType === 'client'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ledgerType: 'client' }));
                      setSelectedPerson(null);
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FaUser className={`w-4 h-4 sm:w-5 sm:h-5 ${formData.ledgerType === 'client' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-sm sm:text-base">Client Ledger</div>
                        <div className="text-xs sm:text-sm text-gray-500">For customers who owe you money</div>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.ledgerType === 'vendor'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ledgerType: 'vendor' }));
                      setSelectedPerson(null);
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FaBuilding className={`w-4 h-4 sm:w-5 sm:h-5 ${formData.ledgerType === 'vendor' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium text-sm sm:text-base">Vendor Ledger</div>
                        <div className="text-xs sm:text-sm text-gray-500">For suppliers you owe money to</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Select from Existing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from Existing {formData.ledgerType === 'client' ? 'Clients' : 'Vendors'}
                </label>
                <div className="relative">
                  <select
                    value={selectedPerson?.id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) {
                        const person = getAvailablePeople().find(p => p.id === selectedId);
                        if (person) {
                          handlePersonSelect(person, formData.ledgerType);
                        }
                      } else {
                        setSelectedPerson(null);
                        setFormData(prev => ({
                          ...prev,
                          personName: '',
                          phone: '',
                          address: ''
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose from existing {formData.ledgerType === 'client' ? 'clients' : 'vendors'}...</option>
                    {formData.ledgerType === 'client' && loadingClients && (
                      <option disabled>Loading clients...</option>
                    )}
                    {formData.ledgerType === 'vendor' && loadingVendors && (
                      <option disabled>Loading vendors...</option>
                    )}
                    {getAvailablePeople().map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} {person.phone ? `(${person.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {getAvailablePeople().length === 0 && !loadingClients && !loadingVendors && (
                  <p className="text-sm text-gray-500 mt-1">
                    No existing {formData.ledgerType === 'client' ? 'clients' : 'vendors'} found. You can create a new one below.
                  </p>
                )}
                {/* Debug info */}
                <div className="text-xs text-gray-400 mt-1">
                  Debug: {formData.ledgerType === 'client' ? `${clients.length} clients` : `${vendors.length} vendors`} loaded
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or create new</span>
                </div>
              </div>

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

              <UIInput
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Khata'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add Transaction Sidebar Component
const AddTransactionSidebar = ({ isOpen, onClose, onSuccess, onError, khatas, preSelectedKhata }) => {
  const [formData, setFormData] = useState({
    khataId: '',
    type: 'credit',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedKhata, setSelectedKhata] = useState(null);

  // Set pre-selected khata when sidebar opens
  useEffect(() => {
    if (isOpen && preSelectedKhata) {
      setFormData(prev => ({
        ...prev,
        khataId: preSelectedKhata._id
      }));
      setSelectedKhata(preSelectedKhata);
    } else if (isOpen && !preSelectedKhata) {
      // Reset form when opening without pre-selection
      resetForm();
    }
  }, [isOpen, preSelectedKhata]);

  const resetForm = () => {
    setFormData({
      khataId: '',
      type: 'credit',
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setSelectedKhata(null);
  };

  const handleKhataSelect = (khataId) => {
    const khata = khatas.find(k => k._id === khataId);
    setSelectedKhata(khata);
    setFormData(prev => ({ ...prev, khataId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.khataId) {
      onError('Please select a khata');
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      onError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      onError('Please enter a description');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_ENDPOINTS.KHATA}/${formData.khataId}/entries`, formData, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        onSuccess();
        resetForm();
      } else {
        onError(response.data.message || 'Error adding transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      const errorMessage = error.response?.data?.message || 'Error adding transaction';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add Transaction</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Khata */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Khata *</label>
                {preSelectedKhata ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {preSelectedKhata.personName} ({preSelectedKhata.ledgerType}) - Balance: {formatCurrency(preSelectedKhata.currentBalance, 'INR')}
                  </div>
                ) : (
                  <select
                    value={formData.khataId}
                    onChange={(e) => handleKhataSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a khata...</option>
                    {khatas.map((khata) => (
                      <option key={khata._id} value={khata._id}>
                        {khata.personName} ({khata.ledgerType}) - Balance: {formatCurrency(khata.currentBalance, 'INR')}
                      </option>
                    ))}
                  </select>
                )}
                {selectedKhata && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm">
                      <div className="font-medium">{selectedKhata.personName}</div>
                      <div className="text-gray-600">{selectedKhata.phone || 'No phone'}</div>
                      <div className="text-gray-600">{selectedKhata.address || 'No address'}</div>
                      <div className="mt-1 text-xs">
                        Current Balance: <span className={`font-medium ${selectedKhata.currentBalance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(selectedKhata.currentBalance, 'INR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type *</label>
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
                min="0.01"
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

              <UIInput
                label="Description *"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Enter transaction description"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KhataList;
