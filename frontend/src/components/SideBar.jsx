import React, { useEffect, useState } from 'react';
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from 'react-pro-sidebar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaChartPie,
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaBars,
  FaSignOutAlt,
  FaShoppingBasket,
  FaShoppingBag
} from 'react-icons/fa';
import { FaShop } from "react-icons/fa6";
import { BsPersonBadgeFill } from "react-icons/bs";
import { IoIosPerson } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { LuShoppingBag } from "react-icons/lu";
import { TbInvoice } from "react-icons/tb";
import axios from 'axios';
import { useAuth } from '../assets/AuthContext';

function SideBar() {
  const { collapseSidebar, collapsed } = useProSidebar();
  const [avatar, setAvatar] = useState("https://via.placeholder.com/40");
  const [userName, setUserName] = useState("User");
  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  // Fetch user avatar and name from the server
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // console.log(localStorage.getItem("userId")) ;

        const response = await axios.get(`http://localhost:4000/avatar/${userId}`);
        setAvatar(response.data.avatar || "https://via.placeholder.com/40"); // Use default if no avatar
        setUserName(response.data.name || "User"); // Set user name if available
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };

    fetchAvatar();
  }, []);


  const linkClass = ({ isActive }) =>
    `text-gray-300 no-underline ${isActive ? 'bg-slate-700' : ''}`;

  return (
    <Sidebar backgroundColor="#1e293b" style={{ height: '90vh' }} rootStyles={{
      color: '#f6f6f6',
    }}>
      <div className="flex items-center justify-between px-4 p-2 text-yellow-400 ">
        {!collapsed &&
          <Link to='/dashboard'><h2 className="text-lg font-bold">Dashboard</h2></Link>}
        <button onClick={() => collapseSidebar()} className="text-gray-300 hover:text-gray-700 pl-3">
          <FaBars className='text-xl cursor-pointer' />
        </button>
      </div>

      <Menu iconShape="circle" >
        <SubMenu label="Items" icon={<FaShoppingBag />} className="text-gray-300 hover:text-gray-700 ">
          <MenuItem
            icon={<FaShoppingBasket />} className='text-gray-700'
            component={<NavLink to="/dashboard/item/newitem" className={linkClass} />}
          >
            NewItems
          </MenuItem>
          <MenuItem
            icon={<FaShop />} className='text-gray-700'
            component={<NavLink to="/dashboard/item/list" className={linkClass} />}
          >
            Inventory Items
          </MenuItem>
        </SubMenu>

        <SubMenu label="Sales" icon={<IoCartOutline />} className="text-gray-300 hover:text-gray-700">
          <MenuItem
            icon={<IoIosPerson />} className='text-gray-700'
            component={<NavLink to="/dashboard/client" className={linkClass} />}
          >
            Customers
          </MenuItem>
          <MenuItem
            icon={<FaChartLine />} className='text-gray-700'
            component={<NavLink to="/dashboard/invoice" className={linkClass} />}
          >
            Invoices
          </MenuItem>

        </SubMenu>

        <SubMenu label="Purchases" icon={<LuShoppingBag />} className="text-gray-300 hover:text-gray-700">
          <MenuItem
            icon={<BsPersonBadgeFill />} className='text-gray-700'
            component={<NavLink to="/dashboard/vendor" className={linkClass} />}
          >
            Vender
          </MenuItem>
          <MenuItem
            icon={<TbInvoice />} className='text-gray-700'
            component={<NavLink to="/dashboard/PurchaseBill" className={linkClass} />}
          >
            Bill
          </MenuItem>



        </SubMenu>

        <MenuItem
          icon={<FaBook />}
          component={<NavLink to="/dashboard/PurchaseBill/" className={linkClass} />}
        >
          Documentation
        </MenuItem>

        <MenuItem
          icon={<FaCalendarAlt />}
          component={<NavLink to="/dashboard/PurchaseBill/edit/:id" className={linkClass} />}
        >
          Calendar
        </MenuItem>
      </Menu>
      <div
        className="absolute bottom-0 w-full p-2  border-t border-slate-600 text-white flex items-center gap-3 bg-slate-800"
      >
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        {!collapsed && (
          <div className="flex justify-around items-center w-full">
            <div className="text-sm font-medium">{userName} </div>
            <NavLink
              to="/logout" onClick={handleLogout}
              className="text-xs text-red-400 flex items-center gap-1 hover:text-red-300"
            >
              <FaSignOutAlt /> Logout
            </NavLink>
          </div>
        )}
      </div>
    </Sidebar>
  );
}

export default SideBar;
