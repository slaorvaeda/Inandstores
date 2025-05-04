import React from "react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Dashboard!</h1>
        <p className="text-gray-600 mb-6">You're now logged in.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
