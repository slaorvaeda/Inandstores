import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaList,
  FaUsers,
  FaFileInvoice,
  FaShoppingCart,
  FaUserTie,
  FaReceipt,
  FaBook,
} from 'react-icons/fa';
import {
  IoCartOutline,
} from 'react-icons/io5';
import {
  LuShoppingBag,
} from 'react-icons/lu';
import axios from 'axios';
import { useAuth } from '../assets/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function SideBar({ isMobileMenuOpen, setIsMobileMenuOpen, isCollapsed, setIsCollapsed }) {
  const [avatar, setAvatar] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='16' text-anchor='middle' fill='%236b7280'%3E👤%3C/text%3E%3C/svg%3E");
  const [userName, setUserName] = useState("User");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(API_ENDPOINTS.USER_AVATAR + `/${userId}`);
        setAvatar(response.data.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='16' text-anchor='middle' fill='%236b7280'%3E👤%3C/text%3E%3C/svg%3E");
        setUserName(response.data.name || "User");
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };

    fetchUserData();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 no-underline transition-colors duration-200 ${
      isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 no-underline transition-colors duration-200 ${
      isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  const menuItems = [
    {
      label: "Items",
      icon: <FaShoppingBag />,
      subItems: [
        {
          label: "New Items",
          icon: <FaShoppingCart />,
          path: "/dashboard/item/newitem"
        },
        {
          label: "Inventory Items",
          icon: <FaList />,
          path: "/dashboard/item/list"
        }
      ]
    },
    {
      label: "Sales",
      icon: <IoCartOutline />,
      subItems: [
        {
          label: "Customers",
          icon: <FaUsers />,
          path: "/dashboard/client"
        },
        {
          label: "Invoices",
          icon: <FaFileInvoice />,
          path: "/dashboard/invoice"
        },
        {
          label: "Orders",
          icon: <FaShoppingCart />,
          path: "/dashboard/order"
        }
      ]
    },
    {
      label: "Purchases",
      icon: <LuShoppingBag />,
      subItems: [
        {
          label: "Vendor",
          icon: <FaUserTie />,
          path: "/dashboard/vendor"
        },
        {
          label: "Bill",
          icon: <FaReceipt />,
          path: "/dashboard/purchasebill"
        }
      ]
    },
    {
      label: "Khata",
      icon: <FaBook />,
      subItems: [
        {
          label: "All Khatas",
          icon: <FaBook />,
          path: "/dashboard/khata"
        }
      ]
    },

  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? 'w-64' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-900">
        {(!isCollapsed || isMobile) && (
          <Link to='/dashboard' className="text-lg font-bold text-slate-700 dark:text-slate-200">
            Dashboard
          </Link>
        )}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuItems.map((menuItem, index) => (
          <div key={index} className="mb-2">
            <div className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              {menuItem.icon}
              {(!isCollapsed || isMobile) && <span>{menuItem.label}</span>}
            </div>
            {menuItem.subItems.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                to={subItem.path}
                className={isMobile ? mobileLinkClass : linkClass}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{subItem.icon}</span>
                {(!isCollapsed || isMobile) && <span>{subItem.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-sm"
          />
          {(!isCollapsed || isMobile) && (
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{userName}</div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-1 transition-colors"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 h-full sidebar-container shadow-lg">
          <SidebarContent isMobile={true} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <div className={`bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 h-full transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}>
          <SidebarContent />
        </div>
      </div>
    </>
  );
}

export default SideBar;
