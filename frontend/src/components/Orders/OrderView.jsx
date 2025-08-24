import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const OrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.ORDER_BY_ID(id));
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <p><strong>Order Number:</strong> {order.orderNumber || 'N/A'}</p>
      <p><strong>Client:</strong> {order.client?.name || 'Unnamed Client'}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
      <p><strong>Currency:</strong> {order.currency}</p>

      <h3 className="mt-4 font-semibold">Items:</h3>
      <table className="w-full text-left border border-gray-300">
        <thead>
          <tr>
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Rate</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.item?.name || 'Unnamed Item'}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">₹{item.rate.toFixed(2)}</td>
              <td className="border px-2 py-1">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4"><strong>Subtotal:</strong> ₹{order.subTotal.toFixed(2)}</p>
      <p><strong>Discount:</strong> ₹{order.discount.toFixed(2)}</p>
      <p><strong>CGST:</strong> ₹{order.cgstAmount.toFixed(2)}</p>
      <p><strong>SGST:</strong> ₹{order.sgstAmount.toFixed(2)}</p>
      <p><strong>IGST:</strong> ₹{order.igstAmount.toFixed(2)}</p>
      <p><strong>Round Off:</strong> ₹{order.roundOff.toFixed(2)}</p>
      <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>

      <p><strong>Customer Notes:</strong> {order.customerNotes || '-'}</p>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};

export default OrderView;
