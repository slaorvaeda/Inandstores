import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

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
                        <Link to={`/dashboard/invoice/${invoice._id}`} className="text-blue-600 underline">View</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceList;
