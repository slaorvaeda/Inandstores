import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const InvoiceView = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  const { invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.INVOICE_BY_ID(invoiceId));
        setInvoice(response.data);
      } catch (err) {
        setError('Failed to fetch invoice details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);



  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(API_ENDPOINTS.INVOICE_BY_ID(invoiceId));
        alert('Invoice deleted.');
        navigate('/invoices');
      } catch {
        alert('Delete failed.');
      }
    }
  };

  const handleUpdate = () => navigate(`/invoices/edit/${invoiceId}`);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!invoice) return <div className="text-center text-gray-600">Invoice not found.</div>;

  const cellStyle = "border px-2 py-1 text-left";

  return (
    <div className="p-4">
      <div
        ref={printRef}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          fontFamily: 'Arial',
          padding: '20px',
          border: '1px solid #ccc',
          maxWidth: '800px',
          margin: 'auto',
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-4">RAGHUNATH TRADERS</h1>
        <p className="text-center text-sm text-gray-600 mb-2">
          Raghunathtraders, Hirli, Near Firestation, Nabarangapur, Odisha - 764059<br />
          GSTIN: 21BEWPN1437B1ZQ
        </p>

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-bold">TAX INVOICE</h2>
            <p>Invoice #: {invoice.invoiceNumber}</p>
            <p>Date: {invoice.invoiceDate}</p>
            <p>Due Date: {invoice.dueDate}</p>
            <p>Terms: {invoice.terms}</p>
          </div>
          <div>
            <h2 className="font-bold">Bill To</h2>
            <p>{invoice.client.name}</p>
          </div>
        </div>

        <table className="w-full border text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className={cellStyle}>Item & Description</th>
              <th className={cellStyle}>Qty</th>
              <th className={cellStyle}>Rate</th>
              <th className={cellStyle}>CGST</th>
              <th className={cellStyle}>SGST</th>
              <th className={cellStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className={cellStyle}>{item.itemName}</td>
                <td className={cellStyle}>{item.quantity}</td>
                <td className={cellStyle}>{item.rate}</td>
                <td className={cellStyle}>{invoice.cgstAmount}%</td>
                <td className={cellStyle}>{invoice.sgstAmount}%</td>
                <td className={cellStyle}>{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-sm mb-6">
          <p>Sub Total: ₹{invoice.subTotal}</p>
          <p>CGST {invoice.taxPercent}%: ₹{invoice.cgstAmount}</p>
          <p>SGST {invoice.taxPercent}%: ₹{invoice.sgstAmount}</p>
          <p>Round Off: ₹{invoice.roundOff}</p>
          <p className="font-bold text-lg">Total: ₹{invoice.totalAmount}</p>
          <p className="italic text-gray-600">In Words: {invoice.totalInWords}</p>
        </div>

        <div className="text-sm mb-4">
          <h3 className="font-bold">Bank Details:</h3>
          <p>Account No: {invoice.bankDetails.accountNumber}</p>
          <p>IFSC: {invoice.bankDetails.ifsc}</p>
          <p>Bank Name: {invoice.bankDetails.bankName}</p>
          <p>Branch: {invoice.bankDetails.branch}</p>
        </div>

        <div className="text-sm mb-4">
          <h3 className="font-bold">Notes:</h3>
          <p>{invoice.customerNotes}</p>
        </div>

        <div className="text-sm mb-4">
          <h3 className="font-bold">Terms & Conditions:</h3>
          <p>{invoice.termsAndConditions}</p>
        </div>

        <div className="mt-8 text-right">
          <p className="font-bold">Authorized Signature</p>
        </div>
      </div>

      <div className="text-center mt-4 space-x-2">
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`Invoice_${invoice.invoiceNumber}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              <button className="bg-gray-400 text-white px-4 py-2 rounded">Preparing...</button>
            ) : (
              <button className="bg-green-600 text-white px-4 py-2 rounded">Download PDF</button>
            )
          }
        </PDFDownloadLink>
        <button onClick={() => navigate(-1)} className="bg-gray-600 text-white px-4 py-2 rounded">Go Back</button>
      </div>
    </div>
  );
};

export default InvoiceView;
