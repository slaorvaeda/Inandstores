import { signInWithPopup, signOut, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

export const googleAuthService = {
  // Sign in with Google using popup instead of redirect
  async signInWithGoogle() {
    try {
      console.log('GoogleAuthService: Starting sign-in process...');
      console.log('GoogleAuthService: Auth object:', auth);
      console.log('GoogleAuthService: Google provider:', googleProvider);
      
      // Check if we're returning from a redirect (for backward compatibility)
      console.log('GoogleAuthService: Checking for redirect result...');
      const result = await getRedirectResult(auth);
      console.log('GoogleAuthService: Redirect result:', result);
      
      if (result) {
        console.log('GoogleAuthService: User signed in via redirect');
        // User just signed in via redirect
        const user = result.user;
        console.log('GoogleAuthService: User object:', user);
        console.log('GoogleAuthService: User email:', user.email);
        console.log('GoogleAuthService: User display name:', user.displayName);
        
        // Get the ID token from Firebase
        console.log('GoogleAuthService: Getting Firebase ID token...');
        const idToken = await user.getIdToken();
        console.log('GoogleAuthService: Got Firebase ID token, length:', idToken.length);
        
        // Send the token to our backend for verification and JWT generation
        console.log('GoogleAuthService: Sending token to backend...');
        const response = await axios.post('http://localhost:4000/api/auth/google/login', {
          token: idToken
        });
        console.log('GoogleAuthService: Backend response:', response.data);
        
        // Return the backend JWT and user to the caller (login page)
        const { token, user: userData } = response.data;
        return {
          success: true,
          user: userData,
          token: token
        };
      } else {
        console.log('GoogleAuthService: No redirect result, starting popup...');
        console.log('GoogleAuthService: About to call signInWithPopup...');
        
        // Start the sign-in process with popup (opens in new tab)
        const result = await signInWithPopup(auth, googleProvider);
        console.log('GoogleAuthService: Popup sign-in successful');
        
        const user = result.user;
        console.log('GoogleAuthService: User object:', user);
        console.log('GoogleAuthService: User email:', user.email);
        console.log('GoogleAuthService: User display name:', user.displayName);
        
        // Get the ID token from Firebase
        console.log('GoogleAuthService: Getting Firebase ID token...');
        const idToken = await user.getIdToken();
        console.log('GoogleAuthService: Got Firebase ID token, length:', idToken.length);
        
        // Send the token to our backend for verification and JWT generation
        console.log('GoogleAuthService: Sending token to backend...');
        const response = await axios.post('http://localhost:4000/api/auth/google/login', {
          token: idToken
        });
        console.log('GoogleAuthService: Backend response:', response.data);
        
        // Return the backend JWT and user to the caller (login page)
        const { token, user: userData } = response.data;
        return {
          success: true,
          user: userData,
          token: token
        };
      }
      
    } catch (error) {
      console.error('GoogleAuthService: Error during sign-in:', error);
      console.error('GoogleAuthService: Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw new Error(error.response?.data?.message || error.message || 'Google authentication failed');
    }
  },

  // Sign out
  async signOut() {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      return { success: true };
      
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed');
    }
  },

  // Get current user from Firebase
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  // Validate Google token with backend
  async validateGoogleToken(idToken) {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/google/validate', {
        token: idToken
      });
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, message: error.response?.data?.message || 'Token validation failed' };
    }
  }
};
