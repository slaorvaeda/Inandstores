import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const VendorForm = ({ onVendorCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const token = localStorage.getItem('token');

  const onSubmit = async data => {
    try {
      await axios.post('http://localhost:4000/api/vendors', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      reset();
      // Refresh vendor list
      if (onVendorCreated) onVendorCreated();
    } catch (err) {
      console.error('Error creating vendor:', err.response?.data?.message || err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Vendor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            placeholder="Vendor Name"
            {...register('name', { required: true })}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            placeholder="Company"
            {...register('company')}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            placeholder="Phone"
            {...register('phone')}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            placeholder="Address"
            {...register('address')}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number</label>
          <input
            placeholder="GST Number"
            {...register('gstNumber')}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            placeholder="Additional Notes"
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        >
          Add Vendor
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
