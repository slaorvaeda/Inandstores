import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../assets/AuthContext";
import DashNavbar from "../components/DashNavbar";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navbar */}
      <DashNavbar onMenuToggle={handleMenuToggle} />

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <SideBar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300">
          {/* Mobile: Full width with proper spacing */}
          <div className="lg:hidden p-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm min-h-[calc(100vh-8rem)] border border-slate-200 dark:border-slate-700">
              <Outlet />
            </div>
          </div>
          
          {/* Desktop: Standard layout */}
          <div className="hidden lg:block p-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm min-h-[calc(100vh-8rem)] border border-slate-200 dark:border-slate-700">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;