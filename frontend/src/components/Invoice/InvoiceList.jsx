import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDelete, MdOutlineRemoveRedEye } from "react-icons/md";


const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await axios.get('http://localhost:4000/invoices');
                setInvoices(res.data.invoices);
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

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Invoices</h2>
            <div className="space-y-4">
                {invoices.map(invoice => (
                    <div key={invoice._id} className="p-4 border rounded flex justify-between items-center">
                        <div>
                            <div className="font-semibold">#{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-600">Date: {invoice.invoiceDate}</div>
                        </div>
                        <div className="flex gap-2 justify-center items-center">
                            <Link to={`/dashboard/invoice/${invoice._id}`} className="bg-green-300  text-white"
                                style={buttonStyle}>
                                <MdOutlineRemoveRedEye />
                            </Link>
                            <button
                                style={deleteButtonStyle}
                                onClick={() => handleDelete(invoice._id)}
                            >
                                <MdDelete />
                            </button>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceList;
