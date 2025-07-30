import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdOutlineRemoveRedEye, MdModeEdit } from "react-icons/md";
import { FaFileInvoice, FaRupeeSign, FaCalendarAlt, FaUser } from 'react-icons/fa';

function List(props) {
    const { name, heading, lists, handleDelete } = props;
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getStatusColor = (dueDate) => {
        if (!dueDate) return 'bg-gray-100 text-gray-800';
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'bg-red-100 text-red-800';
        if (diffDays <= 7) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (dueDate) => {
        if (!dueDate) return 'No Due Date';
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Overdue';
        if (diffDays <= 7) return 'Due Soon';
        return 'On Time';
    };

    const totalAmount = lists.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const totalItems = lists.length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
                            <p className="mt-2 text-gray-600">Manage your {name.toLowerCase()} records</p>
                        </div>
                        <button
                            onClick={() => navigate("add")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                        >
                            <span className="mr-2">+</span> Add New {name}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaFileInvoice className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total {name}s</p>
                                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaRupeeSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {lists.filter(item => {
                                        const itemDate = new Date(name === 'Order' ? item.orderDate : item.invoiceDate);
                                        const now = new Date();
                                        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">All {name}s</h3>
                    </div>
                    
                    {lists.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No {name.toLowerCase()}s found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new {name.toLowerCase()}.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate("add")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <span className="mr-2">+</span> Add New {name}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{name} Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        {name === 'Invoice' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lists.map((data) => (
                                        <tr key={data._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{name === 'Order' ? data.orderNumber : data.invoiceNumber}
                                                    </div>
                                                    {data.salesperson && (
                                                        <div className="text-sm text-gray-500">
                                                            {data.salesperson}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {data.client?.name || 'N/A'}
                                                </div>
                                                {data.client?.phone && (
                                                    <div className="text-sm text-gray-500">
                                                        {data.client.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ₹{data.totalAmount?.toFixed(2) || '0.00'}
                                                </div>
                                                {data.items?.length && (
                                                    <div className="text-sm text-gray-500">
                                                        {data.items.length} items
                                                    </div>
                                                )}
                                            </td>
                                            {name === 'Invoice' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.dueDate)}`}>
                                                        {getStatusText(data.dueDate)}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(name === 'Order' ? data.orderDate : data.invoiceDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        to={`/dashboard/${name.toLowerCase()}/${data._id}`}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                                        title={`View ${name}`}
                                                    >
                                                        <MdOutlineRemoveRedEye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        to={`/dashboard/${name.toLowerCase()}/edit/${data._id}`}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                                                        title={`Edit ${name}`}
                                                    >
                                                        <MdModeEdit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(data._id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                        title={`Delete ${name}`}
                                                    >
                                                        <MdDelete className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default List;