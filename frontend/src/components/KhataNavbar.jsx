import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaHome, FaPlus, FaList } from 'react-icons/fa';

const KhataNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/khata" className="flex items-center space-x-2">
              <FaBook className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Khata Book</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/khata"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                isActive('/khata') && !location.pathname.includes('/khata/')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FaList className="h-4 w-4" />
              <span>All Khatas</span>
            </Link>

            <Link
              to="/khata-setup"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                isActive('/khata-setup')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FaPlus className="h-4 w-4" />
              <span>Setup</span>
            </Link>

            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center space-x-1"
            >
              <FaHome className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default KhataNavbar;
