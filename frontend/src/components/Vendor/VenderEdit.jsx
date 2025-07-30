import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:4000/api/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVendor(res.data);
      } catch (error) {
        console.error("Error fetching vendor:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:4000/api/vendors/${id}`, vendor, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Vendor updated successfully!");
      navigate("/dashboard/vendor");
    } catch (error) {
      console.error("Error updating vendor:", error.response?.data?.message || error.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading vendor...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Vendor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={vendor.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={vendor.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={vendor.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={vendor.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update Vendor
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorEdit;
