import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:4000/api/vendors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:4000/api/vendors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendors(vendors.filter((vendor) => vendor._id !== id));
    } catch (error) {
      console.error("Error deleting vendor:", error.response?.data?.message || error.message);
    }
  };

  const handleView = (vendor) => {
    alert(JSON.stringify(vendor, null, 2));
  };

  if (loading) return <p className="text-center text-gray-500">Loading vendors...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex bg-gray-300 rounded-sm justify-between items-center p-4 my-2">
        <h2 className="text-2xl font-bold text-center">Vendor List</h2>
        <button
          onClick={() => navigate("add")}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          <span className="text-center pr-1">+</span>New
        </button>
      </div>

      {vendors.length === 0 ? (
        <p className="text-center text-gray-500">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr
                  key={vendor._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-2">{vendor.name}</td>
                  <td className="px-4 py-2">{vendor.email}</td>
                  <td className="px-4 py-2">{vendor.phone}</td>
                  <td className="px-4 py-2">{vendor.address}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => navigate(`view/${vendor._id}`)} className="px-3 py-1 mr-2">
                      <GrView className="text-blue-500 hover:text-blue-600 text-xl cursor-pointer" />
                    </button>
                    <button onClick={() => navigate(`edit/${vendor._id}`)} className="px-3 py-1 mr-2">
                      <CiEdit className="text-yellow-500 hover:text-yellow-600 text-xl cursor-pointer" />
                    </button>
                    <button onClick={() => handleDelete(vendor._id)} className="px-3 py-1">
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
};

export default VendorList;
