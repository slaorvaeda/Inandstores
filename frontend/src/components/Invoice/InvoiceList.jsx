import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDelete, MdOutlineRemoveRedEye,MdModeEdit } from "react-icons/md";


const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await axios.get('http://localhost:4000/invoices');
                setInvoices(res.data.invoices);
                console.log('Fetched invoices:', invoices);
            } catch (err) {
                console.error('Error fetching invoices:', err);
            }
        };

        fetchInvoices();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await axios.delete(`http://localhost:4000/invoices/${id}`);
                alert('Invoice deleted successfully.');
                setInvoices(prev => prev.filter(inv => inv._id !== id));
                navigate('/dashboard/invoice'); // Redirect to the invoices list
            } catch (err) {
                alert('Failed to delete the invoice.');
            }
        }
    };

    const buttonStyle = {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        textAlign: 'center',

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

 

    return (
        <div className="container p-4 mx-auto">
        <div className="flex bg-gray-300 rounded-sm justify-between items-center p-4 my-2">
          <h2 className="text-2xl font-bold text-center">Invoices</h2>
          <button
            onClick={() => navigate("add")}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            <span className="text-center pr-1">+</span>New
          </button>
        </div>
      
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="text-left py-2 px-4 border-b">Invoice No</th>
                <th className="text-left py-2 px-4 border-b">Client Name</th>
                <th className="text-left py-2 px-4 border-b">Date</th>
                <th className="text-left py-2 px-4 border-b">Total Amount</th>
                <th className="text-left py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-semibold">#{invoice.invoiceNumber}</td>
                  <td className="py-2 px-4 border-b">{invoice.client?.name}</td>
                  <td className="py-2 px-4 border-b">{formatDate(invoice.invoiceDate)}</td>
                  <td className="py-2 px-4 border-b">₹{invoice.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/invoice/${invoice._id}`}
                        className="  p-1 "
                        
                      >
                        <MdOutlineRemoveRedEye className='text-blue-500 hover:text-blue-600 text-lg cursor-pointer'/>
                      </Link>
                      <Link
                        to={`/dashboard/invoice/${invoice._id}`}
                        className="  p-1 "
                        
                      >
                        <MdModeEdit className='text-green-500 hover:text-green-600 text-lg cursor-pointer'/>
                      </Link>
                      <button
                        onClick={() => handleDelete(invoice._id)}
                        className=" text-white p-1 "
                        
                      >
                        <MdDelete className='text-red-500 hover:text-red-600 text-lg cursor-pointer'/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    );
};

export default InvoiceList;
