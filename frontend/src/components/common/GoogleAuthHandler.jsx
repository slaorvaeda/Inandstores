import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import axios from 'axios';
import { useAuth } from '../../assets/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

export const GoogleAuthHandler = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const completeLogin = async (user) => {
    try {
      const idToken = await user.getIdToken();
      const response = await axios.post(API_ENDPOINTS.GOOGLE_LOGIN, { token: idToken });
      const { token, user: userData, isNewUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userData.id);
      
      // Set isNewUser flag if this is a new Google user
      if (isNewUser) {
        localStorage.setItem('isNewUser', 'true');
      }
      
      login(userData);
      
      // Redirect based on whether user is new
      if (isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      console.error('Error completing login:', e);
      setError(e.message || 'Google authentication failed');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let unsubscribe;
    
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result) {
          await completeLogin(result.user);
          return;
        }
        
        // Check if user is already signed in
        if (auth.currentUser) {
          await completeLogin(auth.currentUser);
          return;
        }

        // Set up auth state listener for future changes
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            await completeLogin(user);
          } else {
            setIsProcessing(false);
          }
        });

        // If no user and no redirect result, we're not in a Google auth flow
        setIsProcessing(false);
        
      } catch (error) {
        console.error('Google auth redirect error:', error);
        setError(error.message || 'Google authentication failed');
        setIsProcessing(false);
      }
    };

    handleRedirectResult();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [login, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing Google sign-in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthHandler;
