import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ClientUpdate = () => {
    const { id } = useParams(); // Get client ID from URL
    const navigate = useNavigate();
    const [clientData, setClientData] = useState({
        name: '',
        gstNumber: '',
        billingAddress: '',
        shippingAddress: '',
        gstTreatment: 'Unregistered Business',
        placeOfSupply: '',
        contact: {
            email: '',
            phone: '',
        },
    });

    useEffect(() => {
        // Fetch client details to prefill the form
        const fetchClient = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/clients/${id}`);
                setClientData(response.data);
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        fetchClient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('contact.')) {
            const contactField = name.split('.')[1];
            setClientData((prev) => ({
                ...prev,
                contact: { ...prev.contact, [contactField]: value },
            }));
        } else {
            setClientData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/api/clients/update/${id}`, clientData);
            alert('Client updated successfully!');
            navigate('/dashboard/client'); // Redirect to client list
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Client</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={clientData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST Number:</label>
                    <input
                        type="text"
                        name="gstNumber"
                        value={clientData.gstNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Billing Address:</label>
                    <input
                        type="text"
                        name="billingAddress"
                        value={clientData.billingAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Shipping Address:</label>
                    <input
                        type="text"
                        name="shippingAddress"
                        value={clientData.shippingAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">GST Treatment:</label>
                    <select
                        name="gstTreatment"
                        value={clientData.gstTreatment}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Unregistered Business">Unregistered Business</option>
                        <option value="Registered Business">Registered Business</option>
                        <option value="Consumer">Consumer</option>
                        <option value="Overseas">Overseas</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Place of Supply:</label>
                    <input
                        type="text"
                        name="placeOfSupply"
                        value={clientData.placeOfSupply}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="contact.email"
                        value={clientData.contact.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone:</label>
                    <input
                        type="text"
                        name="contact.phone"
                        value={clientData.contact.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Update Client
                </button>
            </form>
        </div>
    );
};

export default ClientUpdate;