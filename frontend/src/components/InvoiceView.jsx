import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const InvoiceView = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/invoices/${invoiceId}`);
        setInvoice(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch invoice details.');
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', fontSize: '18px', color: 'red' }}>{error}</div>;
  }

  if (!invoice) {
    return <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Invoice not found.</div>;
  }

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const sectionStyle = {
    marginBottom: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  };

  const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  const thStyle = {
    backgroundColor: '#f4f4f4',
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

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Invoice #{invoice.invoiceNumber}</h2>

      <div style={sectionStyle}>
        <h3>Client Details</h3>
        <p>Name: {invoice.client?.name}</p>
        <p>Address: {invoice.client?.billingAddress}</p>
        <p>Email: {invoice.client?.contact?.email}</p>
      </div>

      <div style={sectionStyle}>
        <h3>Items</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thTdStyle, ...thStyle }}>Item Name</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Quantity</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Rate</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Tax %</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{item.itemName}</td>
                <td style={thTdStyle}>{item.quantity}</td>
                <td style={thTdStyle}>{item.rate}</td>
                <td style={thTdStyle}>{item.taxRate}</td>
                <td style={thTdStyle}>{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={sectionStyle}>
        <h3>Summary</h3>
        <p>Sub Total: ₹{invoice.subTotal}</p>
        <p>CGST: ₹{invoice.cgstAmount}</p>
        <p>SGST: ₹{invoice.sgstAmount}</p>
        <p>Discount: ₹{invoice.discount}</p>
        <p>Round Off: ₹{invoice.roundOff}</p>
        <p><strong>Total Amount: ₹{invoice.totalAmount}</strong></p>
      </div>

      <div style={sectionStyle}>
        <h3>Bank Details</h3>
        <p>Account Number: {invoice.bankDetails.accountNumber}</p>
        <p>IFSC Code: {invoice.bankDetails.ifsc}</p>
        <p>Bank Name: {invoice.bankDetails.bankName}</p>
        <p>Branch: {invoice.bankDetails.branch}</p>
      </div>

      <div style={sectionStyle}>
        <h3>Notes</h3>
        <p>{invoice.customerNotes}</p>
      </div>

      <div style={sectionStyle}>
        <h3>Terms & Conditions</h3>
        <p>{invoice.termsAndConditions}</p>
      </div>

      <button
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default InvoiceView;