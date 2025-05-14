import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../assets/AuthContext";

const useRedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current route

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token in useRedirectIfAuthenticated:", token);
    // console.log("Current path:", location.pathname);

    
    if (token && location.pathname !== "/dashboard") {
      console.log("Redirecting to /dashboard...");
      navigate("/dashboard");
    }
  }, [navigate, location.pathname, isAuthenticated]); 
};

export default useRedirectIfAuthenticated;