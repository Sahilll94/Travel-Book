import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import { toast } from 'sonner';
import { onAuthStateChangedListener, signOutUser } from './firebase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking authentication with token");
        const response = await AuthService.getUser();

        if (response && response.user) {
          setCurrentUser(response.user);
          setIsAuthenticated(true);
          console.log("User authenticated successfully");
        }
      } catch (error) {
        console.error('Authentication check failed', error);

        if (error.response?.status === 401) {
          console.log("Token invalid or expired, clearing localStorage");
          localStorage.removeItem('token');
          toast.error("Your session has expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update login function to be a callback that can handle navigation
  const login = useCallback((token, user, redirectPath = '/dashboard') => {
    localStorage.setItem('token', token);
    setCurrentUser(user);
    setIsAuthenticated(true);

    // Use a small timeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate(redirectPath);
    }, 300); // Increased from 100ms to 300ms
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Also sign out from Firebase if the user was authenticated with Google
    signOutUser().catch(error => console.error("Firebase sign out error:", error));
    navigate('/login');
    toast.info("You have been logged out");
  }, [navigate]);

  const authValue = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    setCurrentUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;