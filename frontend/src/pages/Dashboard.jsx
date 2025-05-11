import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useAuth } from "../assets/AuthContext";
import { ProSidebarProvider } from "react-pro-sidebar";

const Dashboard = () => {
  const {isAuthenticated } = useAuth(); // Assuming `isAuthenticated` is provided by `useAuth`
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);


  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <ProSidebarProvider >

          <SideBar className="fixed top-0 bg-gray-400" />
          <main className="m-2 bg-gray-200 overflow-auto rounded-lg w-full">
            <Outlet />
            </main>
          
        </ProSidebarProvider>

      </div>
    </>
  );
};

export default Dashboard;
