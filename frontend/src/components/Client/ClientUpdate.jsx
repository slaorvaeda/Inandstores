import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaSave, FaTimes } from 'react-icons/fa';
import { Button, Input, Textarea, Select, Card, LoadingSpinner } from '../common';
import { API_ENDPOINTS, getAuthHeaders, getApiUrlWithUserId } from '../../config/api';

const ClientUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
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

    const gstTreatmentOptions = [
        { value: 'Unregistered Business', label: 'Unregistered Business' },
        { value: 'Registered Business', label: 'Registered Business' },
        { value: 'Consumer', label: 'Consumer' },
        { value: 'Overseas', label: 'Overseas' },
    ];

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_ENDPOINTS.CLIENT_BY_ID(id));
                setClientData(response.data);
            } catch (error) {
                console.error('Error fetching client data:', error);
                alert('Failed to load client data. Please try again.');
                navigate('/dashboard/client');
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id, navigate]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!clientData.name.trim()) {
            newErrors.name = 'Client name is required';
        }
        
        if (clientData.contact.email && !/\S+@\S+\.\S+/.test(clientData.contact.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (clientData.contact.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(clientData.contact.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        if (clientData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clientData.gstNumber)) {
            newErrors.gstNumber = 'Please enter a valid GST number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert GST to uppercase
        let processedValue = value;
        if (name === 'gstNumber') {
            processedValue = value.toUpperCase();
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        if (name.includes('contact.')) {
            const contactField = name.split('.')[1];
            setClientData((prev) => ({
                ...prev,
                contact: { ...prev.contact, [contactField]: processedValue },
            }));
        } else {
            setClientData((prev) => ({ ...prev, [name]: processedValue }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        try {
            await axios.put(API_ENDPOINTS.CLIENT_UPDATE(id), clientData);
            alert('Client updated successfully!');
            navigate('/dashboard/client');
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/client');
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading client data..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
                            <p className="mt-2 text-gray-600">Update client information and details</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            icon={<FaTimes />}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Basic Information Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                    <FaUser className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Client Name"
                                    name="name"
                                    value={clientData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter client name"
                                    error={errors.name}
                                />

                                <Input
                                    label="GST Number"
                                    name="gstNumber"
                                    value={clientData.gstNumber}
                                    onChange={handleChange}
                                    placeholder="22AAAAA0000A1Z5"
                                    error={errors.gstNumber}
                                />

                                <Select
                                    label="GST Treatment"
                                    name="gstTreatment"
                                    value={clientData.gstTreatment}
                                    onChange={handleChange}
                                    options={gstTreatmentOptions}
                                />

                                <Input
                                    label="Place of Supply"
                                    name="placeOfSupply"
                                    value={clientData.placeOfSupply}
                                    onChange={handleChange}
                                    placeholder="e.g., Maharashtra, India"
                                />
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-green-100 rounded-lg mr-3">
                                    <FaEnvelope className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email Address"
                                    name="contact.email"
                                    type="email"
                                    value={clientData.contact.email}
                                    onChange={handleChange}
                                    placeholder="client@example.com"
                                    error={errors.email}
                                />

                                <Input
                                    label="Phone Number"
                                    name="contact.phone"
                                    value={clientData.contact.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    error={errors.phone}
                                />
                            </div>
                        </div>

                        {/* Address Information Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                    <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Textarea
                                    label="Billing Address"
                                    name="billingAddress"
                                    value={clientData.billingAddress}
                                    onChange={handleChange}
                                    placeholder="Enter complete billing address"
                                    rows={3}
                                />

                                <Textarea
                                    label="Shipping Address"
                                    name="shippingAddress"
                                    value={clientData.shippingAddress}
                                    onChange={handleChange}
                                    placeholder="Enter complete shipping address"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={submitting}
                                icon={<FaSave />}
                            >
                                {submitting ? 'Updating...' : 'Update Client'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ClientUpdate;