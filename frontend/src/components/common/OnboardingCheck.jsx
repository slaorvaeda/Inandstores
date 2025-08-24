import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../assets/AuthContext';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const OnboardingCheck = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        // Only check for onboarding if user is trying to access dashboard routes
        // and is a new user who hasn't completed onboarding
        const isDashboardRoute = location.pathname.startsWith('/dashboard');
        const isOnboardingRoute = location.pathname === '/onboarding';
        const isNewUser = localStorage.getItem('isNewUser') === 'true';
        const needsOnboarding = !user.businessName || user.businessName.trim() === '';
        
        if (isDashboardRoute && isNewUser && needsOnboarding) {
          // User is new and trying to access dashboard but hasn't completed onboarding
          navigate('/onboarding', { replace: true });
          return;
        }

        // If user is on onboarding page but has completed onboarding, redirect to dashboard
        if (isOnboardingRoute && !needsOnboarding) {
          navigate('/dashboard', { replace: true });
          return;
        }

        // User has completed onboarding or is not a new user
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user, navigate, location.pathname]);

  if (isChecking) {
    return <LoadingSpinner text="Checking onboarding status..." />;
  }

  return children;
};

export default OnboardingCheck;
