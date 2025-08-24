import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await axios.get(API_ENDPOINTS.USER_PROFILE, {
          headers: getAuthHeaders()
        });
        
        setIsAuthenticated(true);
        setUser(response.data);
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Listen to Firebase auth state changes for Google auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase (Google auth)
        // Check if we have a JWT token for our backend
        const token = localStorage.getItem("token");
        if (token) {
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out from Firebase
        // Only clear auth if we don't have a valid JWT token
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData = null) => {
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(API_ENDPOINTS.USER_PROFILE, {
        headers: getAuthHeaders()
      });
      
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };  

  const logout = async () => {
    try {
      // Sign out from Firebase if user is signed in
      if (auth.currentUser) {
        await auth.signOut();
      }
    } catch (error) {
      console.error("Firebase sign out error:", error);
    }
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Setup global axios interceptors to handle auth automatically
  useEffect(() => {
    // Attach token if Authorization header missing
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (!config.headers) config.headers = {};
        if (!config.headers.Authorization) {
          const token = localStorage.getItem("token");
          if (token) {
            // Always ensure Bearer prefix is present
            config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Auto-logout on invalid/expired token
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 498) {
          try {
            logout();
          } finally {
            // Force redirect to login
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []); // deliberately not depending on logout to avoid re-registering

  const value = {
    isAuthenticated, 
    isLoading, 
    user,
    login, 
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};