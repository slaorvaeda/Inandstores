import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PurchaseBillEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [billData, setBillData] = useState({
    billNumber: "",
    vendor: "",
    billDate: "",
    dueDate: "",
    items: [],
    subTotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    discount: 0,
    roundOff: 0,
    totalAmount: 0,
  });

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [billRes, vendorsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/purchasebills/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/api/vendors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBillData(billRes.data);
        setVendors(vendorsRes.data);
      } catch (err) {
        console.error("Error loading bill or vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...billData.items];
    items[index][field] = value;

    // Optional: recalculate item total
    if (["quantity", "unitPrice", "taxRate"].includes(field)) {
      const quantity = parseFloat(items[index].quantity) || 0;
      const unitPrice = parseFloat(items[index].unitPrice) || 0;
      const taxRate = parseFloat(items[index].taxRate) || 0;
      const amount = quantity * unitPrice;
      const tax = (amount * taxRate) / 100;
      items[index].total = parseFloat((amount + tax).toFixed(2));
    }

    setBillData({ ...billData, items });
    recalculateTotals(items);
  };

  const recalculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const totalAmount = subTotal - (parseFloat(billData.discount) || 0) + (parseFloat(billData.roundOff) || 0);

    setBillData((prev) => ({
      ...prev,
      subTotal: parseFloat(subTotal.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:4000/api/purchasebills/${id}`, billData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Purchase Bill updated successfully!");
      navigate("/dashboard/purchasebill");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update purchase bill.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Purchase Bill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Bill Number</label>
            <input
              type="text"
              name="billNumber"
              value={billData.billNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Vendor</label>
            <select
              name="vendor"
              value={billData.vendor}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Bill Date</label>
            <input
              type="date"
              name="billDate"
              value={billData.billDate?.substring(0, 10)}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={billData.dueDate?.substring(0, 10)}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Item Table */}
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="w-full text-sm border border-gray-300 rounded-md mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">Item Name</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Unit Price</th>
                <th className="px-2 py-1">Tax %</th>
                <th className="px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {billData.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={item.itemName || ""}
                      onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={item.unitPrice || ""}
                      onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={item.taxRate || ""}
                      onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="px-2 py-1 text-right">{item.total?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Discount</label>
            <input
              type="number"
              name="discount"
              value={billData.discount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label>Round Off</label>
            <input
              type="number"
              name="roundOff"
              value={billData.roundOff}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label>Subtotal</label>
            <input
              type="number"
              value={billData.subTotal}
              disabled
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label>Total Amount</label>
            <input
              type="number"
              value={billData.totalAmount}
              disabled
              className="w-full border px-3 py-2 rounded-md bg-gray-100 font-bold"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Update Purchase Bill
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseBillEdit;
