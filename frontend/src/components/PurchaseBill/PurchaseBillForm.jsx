import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const PurchaseBillForm = () => {
  const { register, handleSubmit, getValues, reset } = useForm();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch vendors on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:4000/api/vendors', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVendors(res.data))
      .catch((err) => console.error('Error fetching vendors:', err));
  }, []);

  const handleAddItem = () => {
    const { itemName, quantity, unitPrice, taxRate } = getValues();

    if (!itemName || !quantity || !unitPrice) {
      alert('Fill all item fields');
      return;
    }

    const total = quantity * unitPrice * (1 + (taxRate || 0) / 100);
    const newItem = { itemName, quantity, unitPrice, taxRate: taxRate || 0, total };

    setItems([...items, newItem]);
    setTotalAmount((prev) => prev + total);
    reset({ itemName: '', quantity: '', unitPrice: '', taxRate: '' });
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const billData = {
        billNumber: data.billNumber,
        vendor: data.vendor,
        billDate: data.billDate,
        dueDate: data.dueDate,
        items,
        totalAmount,
        subTotal: totalAmount, // basic for now
        notes: data.notes,
      };

      await axios.post('http://localhost:4000/api/purchasebills/create', billData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Purchase Bill Created Successfully!');
      reset();
      setItems([]);
      setTotalAmount(0);
      
    } catch (error) {
      console.error(error);
      alert('Error creating purchase bill');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Create Purchase Bill</h2>

      <div>
        <label className="block font-medium">Bill Number</label>
        <input
          type="text"
          {...register('billNumber')}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Vendor</label>
        <select {...register('vendor')} required className="w-full border rounded p-2">
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor._id} value={vendor._id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Bill Date</label>
          <input type="date" {...register('billDate')} className="w-full border rounded p-2" required />
        </div>
        <div className="flex-1">
          <label className="block font-medium">Due Date</label>
          <input type="date" {...register('dueDate')} className="w-full border rounded p-2" />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">Add Item</h3>
        <div className="grid grid-cols-4 gap-4 mb-2">
          <input placeholder="Item Name" {...register('itemName')} className="border p-2 rounded" />
          <input type="number" placeholder="Quantity" {...register('quantity', { valueAsNumber: true })} className="border p-2 rounded" />
          <input type="number" placeholder="Unit Price" {...register('unitPrice', { valueAsNumber: true })} className="border p-2 rounded" />
          <input type="number" placeholder="Tax Rate (%)" {...register('taxRate', { valueAsNumber: true })} className="border p-2 rounded" />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Items</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Tax Rate</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{item.itemName}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{item.unitPrice}</td>
                  <td className="p-2 border">{item.taxRate}%</td>
                  <td className="p-2 border">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <label className="block font-medium">Total Amount</label>
        <div className="text-xl font-bold">₹{totalAmount.toFixed(2)}</div>
      </div>

      <div>
        <label className="block font-medium">Notes</label>
        <textarea {...register('notes')} className="w-full border p-2 rounded" rows="3" />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold"
      >
        Submit Purchase Bill
      </button>
    </form>
  );
};

export default PurchaseBillForm;
