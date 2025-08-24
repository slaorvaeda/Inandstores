import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../assets/AuthContext";

const useRedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // If user is authenticated and trying to access login/signup pages, redirect to dashboard
    if (token && isAuthenticated && (location.pathname === "/login" || location.pathname === "/signup")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location.pathname, isAuthenticated]); 
};

export default useRedirectIfAuthenticated;