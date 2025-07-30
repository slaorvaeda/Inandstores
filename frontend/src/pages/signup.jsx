import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRedirectIfAuthenticated from "../hooks/useRedirectIfAuthenticated";

const Signup = () => {
  useRedirectIfAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page which now has both login and signup forms
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // This component won't render anything as it redirects immediately
};

export default Signup;