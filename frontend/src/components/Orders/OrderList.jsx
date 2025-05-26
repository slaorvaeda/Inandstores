import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdOutlineRemoveRedEye, MdModeEdit } from "react-icons/md";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:4000/api/orders/${id}`);
        alert('Order deleted successfully.');
        setOrders(prev => prev.filter(order => order._id !== id));
      } catch (err) {
        alert('Failed to delete the order.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="flex bg-white rounded-sm justify-between items-center p-4 my-2">
        <h2 className="text-2xl font-bold text-center">Orders</h2>
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
              <th className="text-left py-2 px-4 border-b">Order No</th>
              <th className="text-left py-2 px-4 border-b">Client Name</th>
              <th className="text-left py-2 px-4 border-b">Date</th>
              <th className="text-left py-2 px-4 border-b">Total Amount</th>
              <th className="text-left py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b font-semibold">#{order.orderNumber}</td>
                <td className="py-2 px-4 border-b">{order.client?.name}</td>
                <td className="py-2 px-4 border-b">{formatDate(order.orderDate)}</td>
                <td className="py-2 px-4 border-b">₹{order.totalAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2">
                    <Link to={`/dashboard/order/${order._id}`} className="p-1">
                      <MdOutlineRemoveRedEye className="text-blue-500 hover:text-blue-600 text-lg cursor-pointer" />
                    </Link>
                    <Link to={`/dashboard/order/edit/${order._id}`} className="p-1">
                      <MdModeEdit className="text-green-500 hover:text-green-600 text-lg cursor-pointer" />
                    </Link>
                    <button onClick={() => handleDelete(order._id)} className="p-1">
                      <MdDelete className="text-red-500 hover:text-red-600 text-lg cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
