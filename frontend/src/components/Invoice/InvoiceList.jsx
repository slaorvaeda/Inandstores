import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import List from '../List';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(API_ENDPOINTS.INVOICES);
        
        // Check if response has invoices property
        if (res.data && res.data.invoices) {
          setInvoices(res.data.invoices);
        } else if (Array.isArray(res.data)) {
          // If response is directly an array
          setInvoices(res.data);
        } else {
          console.error('Unexpected response format:', res.data);
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError(`Failed to load invoices: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(API_ENDPOINTS.INVOICE_BY_ID(id));
        alert('Invoice deleted successfully.');
        setInvoices(prev => prev.filter(inv => inv._id !== id));
      } catch (err) {
        console.error('Error deleting invoice:', err);
        alert('Failed to delete the invoice.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading invoices...
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
    <List 
      name="Invoice" 
      heading="Invoices" 
      lists={invoices} 
      handleDelete={handleDelete} 
    />
  );
};

export default InvoiceList;
