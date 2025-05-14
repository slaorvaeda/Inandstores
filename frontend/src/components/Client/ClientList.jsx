import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/api/clients', {
          headers: token ? { Authorization: token } : {},
        });
        setClients(res.data.clients);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/clients/${id}`, {
          headers: token ? { Authorization: token } : {},
        });
        setClients((prev) => prev.filter((client) => client._id !== id));
        alert('Client deleted successfully.');
      } catch (err) {
        alert('Failed to delete the client.');
      }
    }
  };

  return (
    <div className="p-4 mx-auto">
           <div className="flex bg-gray-300 rounded-sm justify-between items-center p-4 my-2">
        <h2 className="text-2xl font-bold text-center">Client List</h2>
        <button
          onClick={() => navigate("add")}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 cursor-pointer" >
            <span className=" text-center pr-1  ">+</span>New
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg ">
        <table border = "0" className="min-w-full text-left text-sm border-none bg-white ">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">GST Number</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Phone</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50 border-b-0 cursor-pointer ">
                <td className="px-6 py-4 border-b">{client.name}</td>
                <td className="px-6 py-4 border-b">{client.gstNumber || 'N/A'}</td>
                <td className="px-6 py-4 border-b">{client.contact?.email || 'N/A'}</td>
                <td className="px-6 py-4 border-b">{client.contact?.phone || 'N/A'}</td>
                <td className="px-6 py-4 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`edit-client/${client._id}`)}
                      className="flex items-center gap-1  px-3 py-1 "
                    >
                      <MdEdit className='text-blue-500 hover:text-blue-600 text-xl cursor-pointer '/> 
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="flex items-center gap-1 px-3 py-1 "
                    >
                      <MdDelete className= 'text-red-500 hover:text-red-600 text-xl cursor-pointer' /> 
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
