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
    } catch (err) {
      console.error('Error creating vendor:', err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="vendor-form">
      <input placeholder="Name" {...register('name', { required: true })} />
      {errors.name && <span>Name is required</span>}

      <input placeholder="Company" {...register('company')} />
      <input placeholder="Email" type="email" {...register('email')} />
      <input placeholder="Phone" {...register('phone')} />
      <input placeholder="Address" {...register('address')} />
      <input placeholder="GST Number" {...register('gstNumber')} />
      <textarea placeholder="Notes" {...register('notes')} />

      <button type="submit">Add Vendor</button>
    </form>
  );
};

export default VendorForm;
