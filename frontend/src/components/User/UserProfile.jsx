import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`http://localhost:4000/user/${userId}`);
        setUser(res.data);
        setFormData({ name: res.data.name, password: '', avatar: res.data.avatar || '' });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUserById();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.put(`http://localhost:4000/user/update/${userId}`, formData);
      alert('User updated!');
      setUser(res.data);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Update failed.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (<>

    <h2 className=" container m-auto my-2 mt-6 p-3 rounded-sm text-2xl font-bold bg-gray-200 shadow-md">User Profile</h2>
    <div className="flex container mx-auto p-6 bg-gray-100 rounded shadow-md">
      <div className="flex-1/2">
      <img src={user.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="w-50 h-50 m-auto rounded-full mb-4" />
      </div>
      <form onSubmit={handleUpdate} className="space-y-4 flex-3/4">
        <div>
          <label className="block font-medium mb-1">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className=" px-3 py-2 rounded bg-white" />
        </div>
        <div>
          <label className="block font-medium mb-1">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            className=" px-3 py-2 rounded bg-white" />
        </div>
        <div>
          <label className="block font-medium mb-1">Avatar URL:</label>
          <input type="text" name="avatar" value={formData.avatar} onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white" />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  </>
  );
};

export default UserProfile;
