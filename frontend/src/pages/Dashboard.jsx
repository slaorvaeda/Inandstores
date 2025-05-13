import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../assets/AuthContext";
import { ProSidebarProvider } from "react-pro-sidebar";
import DashNavbar from "../components/DashNavbar";

const Dashboard = () => {
  const { isAuthenticated } = useAuth(); // Assuming `isAuthenticated` is provided by `useAuth`
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="h-screen bg-gray-100">
        <DashNavbar />
        <div className="flex h-[90vh]">
          <ProSidebarProvider>
            <SideBar className="fixed top-0 h-[90vh] bg-gray-400" />
            <main className="m-2bg-gray-200 overflow-auto rounded-lg w-full">
              <Outlet />
            </main>
          </ProSidebarProvider>
        </div>

      </div>
    </>
  );
};

export default Dashboard;