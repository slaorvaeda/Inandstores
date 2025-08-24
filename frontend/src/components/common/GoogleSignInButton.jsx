import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { googleAuthService } from '../../services/googleAuthService';
import { useAuth } from '../../assets/AuthContext';

const GoogleSignInButton = ({ onSignIn, onError, disabled = false, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) {
      return;
    }
    
    try {
      // Call the parent's onSignIn handler (which should be handleGoogleSignInButton)
      if (onSignIn) {
        // Don't set loading state here - let the parent handle it
        await onSignIn();
      } else {
        // Only set loading state when using default flow
        setIsLoading(true);
        
        // Fallback to direct service call
        const result = await googleAuthService.signInWithGoogle();
        
        if (result.redirecting) {
          return;
        }
        if (result.success && result.user && result.token) {
          // Handle the result here if no parent handler
        }
      }
    } catch (error) {
      console.error('GoogleSignInButton: Google sign-in failed:', error);
      
      // Call the error callback
      if (onError) {
        onError(error.message);
      }
    } finally {
      // Only reset loading state if we set it (default flow)
      if (!onSignIn) {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={`
        w-full flex items-center justify-center px-4 py-3 border border-gray-300 
        rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
        ${className}
      `}
    >
      {(isLoading || disabled) ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      ) : (
        <FaGoogle className="h-5 w-5 text-red-500 mr-3" />
      )}
      <span className="font-medium">
        {(isLoading || disabled) ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  );
};

export default GoogleSignInButton;
