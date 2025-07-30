import React from 'react';
import SvgLogo from '../assets/SvgLogo';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const DashNavbar = ({ onMenuToggle }) => {
    const handleMenuClick = () => {
        if (onMenuToggle) {
            onMenuToggle();
        }
    };

    return (
        <nav className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 lg:px-0 lg:pr-4 py-3 lg:py-4 flex items-center justify-between shadow-sm">
            {/* Left side - Hamburger (mobile only) */}
            <div className="flex items-center w-12 lg:hidden">
                {/* Mobile Hamburger Button */}
                <button 
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={handleMenuClick}
                    type="button"
                >
                    <FaBars className="text-xl" />
                </button>
            </div>

            {/* Center - Logo (mobile) and Left - Logo (desktop) */}
            <div className="flex items-center justify-center flex-1 lg:flex-none lg:justify-start">
                <div className="flex items-center">
                    <SvgLogo />
                </div>
            </div>

            {/* Right side - Search and Profile */}
            <div className="flex items-center w-12 lg:w-auto">
                {/* Search - Hidden on mobile */}
                <div className="hidden lg:flex items-center space-x-4">
                    <div className="mx-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 px-4 py-2 rounded-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-700 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm"
                        />
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                        <Link to="/dashboard/user/profile">Profile</Link>
                    </button>
                </div>

                {/* Mobile: Only show profile button */}
                <div className="lg:hidden">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md">
                        <Link to="/dashboard/user/profile">Profile</Link>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DashNavbar;