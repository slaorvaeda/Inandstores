import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";



const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/items?userId=${userId}`);
        setItems(response.data);
        console.log("Fetched items:", response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchItems();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleView = (item) => {
    alert(JSON.stringify(item, null, 2)); // You can replace this with a modal
  };

  const handleEdit = (id) => {
    console.log("Edit item:", id);
  };

  if (loading) return <p className="text-center text-gray-500">Loading items...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex bg-gray-300 rounded-sm justify-between items-center p-4">
        <h2 className="text-2xl font-bold text-center">Item List</h2>
        <button
          onClick={() => navigate("newitem")}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer" >
            <span className=" text-center pr-1  ">+</span>New
        </button>


      </div>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Unit</th>
                <th className="px-4 py-2 text-left">HSN Code</th>
                <th className="px-4 py-2 text-left">Tax Preference</th>
                <th className="px-4 py-2 text-left">Selling Price</th>
                <th className="px-4 py-2 text-left">Cost Price</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                >
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">{item.unit}</td>
                  <td className="px-4 py-2">{item.hsnCode}</td>
                  <td className="px-4 py-2">{item.taxPreference}</td>
                  <td className="px-4 py-2">{item.salesInfo?.sellingPrice}</td>
                  <td className="px-4 py-2">{item.purchaseInfo?.costPrice}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleView(item)}
                      className=" text-white px-3 py-1 rounded-md mr-2"
                    >
                      <GrView  className="text-blue-500 hover:text-blue-600 text-xl cursor-pointer"/>

                    </button>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-white px-3 py-1 rounded-md mr-2"
                    >
                     <CiEdit className="text-yellow-500 hover:text-yellow-600 text-xl cursor-pointer"/>

                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className=" text-white px-3 py-1 rounded-md"
                    >
                      <MdDelete className="text-red-500 hover:text-red-600 text-xl cursor-pointer"/>

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

export default ItemList;