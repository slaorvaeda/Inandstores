import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdOutlineRemoveRedEye, MdModeEdit } from "react-icons/md";
import List from '../List';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.ORDERS);
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
        await axios.delete(API_ENDPOINTS.ORDER_BY_ID(id));
        alert('Order deleted successfully.');
        setOrders(prev => prev.filter(order => order._id !== id));
      } catch (err) {
        alert('Failed to delete the order.');
      }
    }
  };


  return (

    <>
    <List heading = {'Orders'} lists = {orders}  handleDelete = {handleDelete}  name = {'Order'}/>
    </>
  );
};

export default OrderList;
