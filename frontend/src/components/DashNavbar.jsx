import React from 'react';
import SvgLogo from '../assets/SvgLogo';
import { Link } from 'react-router-dom';

const DashNavbar = () => {
    return (
        <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div >
                <SvgLogo />
            </div>

          


            {/* Profile btn */}
            <div className="flex items-center ">
                <div className="flex-1 mx-6">
                    <input
                        type="text"
                        placeholder="Search..."
                        className=" px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    <Link to="/dashboard/user/profile">Profile</Link>
                </button>
            </div>
        </nav>
    );
};

export default DashNavbar;