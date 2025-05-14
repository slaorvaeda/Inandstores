import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function PurchaseBillList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:4000/api/purchasebills/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/purchasebills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted bill from UI
      setBills(bills.filter(bill => bill._id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("Failed to delete bill.");
    }
  };

  // ✅ Calculate total of all bill amounts
  const totalAmountSum = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

  if (loading) return <p className="text-center text-gray-500">Loading bills...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center bg-gray-300 rounded-sm p-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Purchase Bills</h2>
          <p className="text-sm text-gray-700">
            Total of All Bills: ₹{totalAmountSum.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => navigate("add")}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          <span className="pr-1">+</span>New
        </button>
      </div>

      {bills.length === 0 ? (
        <p className="text-center text-gray-500">No purchase bills found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Bill No</th>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr
                  key={bill._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-2">{bill.billNumber}</td>
                  <td className="px-4 py-2">{bill.vendor?.name || "-"}</td>
                  <td className="px-4 py-2">{bill.billDate?.substring(0, 10)}</td>
                  <td className="px-4 py-2 text-right">₹{bill.totalAmount?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-3">
                    <Link to={`/dashboard/purchase-bill/view/${bill._id}`}>
                      <GrView className="text-blue-500 hover:text-blue-600 text-xl cursor-pointer" />
                    </Link>
                    <Link to={`/dashboard/PurchaseBill/edit/${bill._id}`}>
                      <CiEdit className="text-yellow-500 hover:text-yellow-600 text-xl cursor-pointer" />
                    </Link>
                    <button onClick={() => handleDelete(bill._id)}>
                      <MdDelete className="text-red-500 hover:text-red-600 text-xl cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PurchaseBillList;
