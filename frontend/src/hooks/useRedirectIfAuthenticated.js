import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
};

export default useRedirectIfAuthenticated;
