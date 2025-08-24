import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../assets/AuthContext";
import DashNavbar from "../components/DashNavbar";
import { OnboardingCheck } from "../components/common";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <OnboardingCheck>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-30">
          <DashNavbar onMenuToggle={handleMenuToggle} />
        </div>

        {/* Fixed Sidebar and Main Content Container */}
        <div className="flex pt-16 r"> {/* pt-16 accounts for fixed navbar height */}
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-20">
            <SideBar 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          </div>
          
          {/* Main Content Area with proper spacing */}
          <main className={`flex-1 rounded-xl transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} `}>
            {/* Mobile: Full width with proper spacing */}
            <div className="lg:hidden p-4 rounded-lg">
              <div className="bg-black/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm min-h-[calc(100vh-8rem)] border border-slate-200 dark:border-slate-700">
                <Outlet />
              </div>
            </div>
            
            {/* Desktop: Standard layout */}
            <div className="hidden lg:block p-6 rounded-lg">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm min-h-[calc(100vh-8rem)] border border-slate-200 dark:border-slate-700 ">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </OnboardingCheck>
  );
};

export default Dashboard;