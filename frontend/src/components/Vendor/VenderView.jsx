import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const VendorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.VENDOR_BY_ID(id), {
          headers: getAuthHeaders(),
        });
        setVendor(response.data);
      } catch (error) {
        console.error("Error fetching vendor:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading vendor...</p>;

  if (!vendor) return <p className="text-center text-red-500">Vendor not found.</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Vendor Details</h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold text-gray-700">Name:</span>
          <p className="text-gray-900">{vendor.name}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span>
          <p className="text-gray-900">{vendor.email || "N/A"}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Phone:</span>
          <p className="text-gray-900">{vendor.phone || "N/A"}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Address:</span>
          <p className="text-gray-900">{vendor.address || "N/A"}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default VendorView;
