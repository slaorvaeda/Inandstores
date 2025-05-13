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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Client List</h2>
      <div className="space-y-6">
        {clients.map((client) => (
          <div
            key={client._id}
            className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex justify-between items-center"
          >
            <div>
              <div className="text-lg font-semibold text-gray-900">{client.name}</div>
              <div className="text-sm text-gray-500">GST: {client.gstNumber || 'N/A'}</div>
              <div className="text-sm text-gray-500">Email: {client.contact?.email || 'N/A'}</div>
              <div className="text-sm text-gray-500">Phone: {client.contact?.phone || 'N/A'}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`edit-client/${client._id}`)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <MdEdit className="text-lg" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(client._id)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <MdDelete className="text-lg" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;