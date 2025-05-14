import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function PurchaseBillView() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/api/purchasebills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBill(res.data);
      } catch (error) {
        console.error("Failed to load bill:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!bill) return <p className="text-center text-red-500">Bill not found.</p>;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Purchase Bill #{bill.billNumber}</h2>
        <Link
          to="/dashboard/purchasebill"
          className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
        >
          Back
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <p><strong>Vendor:</strong> {bill.vendor?.name || "-"}</p>
          <p><strong>Bill Date:</strong> {formatDate(bill.billDate)}</p>
        </div>
        <div>
          <p><strong>Due Date:</strong> {formatDate(bill.dueDate)}</p>
          <p><strong>Bill ID:</strong> {bill._id}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Items</h3>
      <table className="w-full text-sm border border-gray-300 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Item Name</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Unit Price</th>
            <th className="border px-2 py-1">Tax %</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{item.itemName}</td>
              <td className="border px-2 py-1 text-center">{item.quantity}</td>
              <td className="border px-2 py-1 text-right">{item.unitPrice.toFixed(2)}</td>
              <td className="border px-2 py-1 text-right">{item.taxRate}%</td>
              <td className="border px-2 py-1 text-right">{item.total?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Discount:</strong> ₹{bill.discount?.toFixed(2)}</p>
          <p><strong>Round Off:</strong> ₹{bill.roundOff?.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p><strong>Subtotal:</strong> ₹{bill.subTotal?.toFixed(2)}</p>
          <p className="text-lg font-semibold"><strong>Total Amount:</strong> ₹{bill.totalAmount?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default PurchaseBillView;
