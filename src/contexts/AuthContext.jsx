import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// API base URL - change this to match your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function AuthProvider({ children, showNotification }) {
  const [showSecretPortal, setShowSecretPortal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isExitingDashboard, setIsExitingDashboard] = useState(false);
  const [authToken, setAuthToken] = useState(() => {
    // Try to restore token from localStorage on page load
    return localStorage.getItem('dashboard_token');
  });

  const triggerSecretEntry = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const login = useCallback(async (password) => {
    try {
      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      // Call backend API to authenticate
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        // Backend rejected the password
        return { success: false, error: data.error || 'Invalid password' };
      }

      // Login successful! Store the JWT token
      const token = data.token;
      setAuthToken(token);
      localStorage.setItem('dashboard_token', token);

      setShowLoginModal(false);
      setIsLoadingDashboard(true);

      // Show loading animation for 2 seconds before showing dashboard
      setTimeout(() => {
        setIsLoadingDashboard(false);
        setShowSecretPortal(true);
        // Show welcome notification after dashboard loads
        if (showNotification) {
          setTimeout(() => {
            showNotification({
              title: 'Access Granted',
              message: 'Welcome back to Command Center',
              type: 'success',
              duration: 5000
            });
          }, 300);
        }
      }, 2000);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      // Check if the error is a timeout/abort error
      if (error.name === 'AbortError') {
        return { success: false, error: 'Connection timeout. Is the server running?' };
      }
      return { success: false, error: 'Failed to connect to server' };
    }
  }, [showNotification]);

  const logout = useCallback(() => {
    // Clear the auth token
    setAuthToken(null);
    localStorage.removeItem('dashboard_token');

    setIsExitingDashboard(true);

    // Show exit animation for 1.5 seconds before closing portal
    setTimeout(() => {
      setShowSecretPortal(false);
      setIsExitingDashboard(false);
    }, 1500);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const exitSecretPortal = useCallback(() => {
    // Clear the auth token when exiting
    setAuthToken(null);
    localStorage.removeItem('dashboard_token');

    setIsExitingDashboard(true);

    // Show exit animation for 1.5 seconds before closing portal
    setTimeout(() => {
      setShowSecretPortal(false);
      setIsLoadingDashboard(false);
      setIsExitingDashboard(false);
    }, 1500);
  }, []);

  // Helper function to get auth token for API calls
  const getAuthHeaders = useCallback(() => {
    if (!authToken) {
      return {};
    }
    return {
      'Authorization': `Bearer ${authToken}`,
    };
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        showSecretPortal,
        showLoginModal,
        isLoadingDashboard,
        isExitingDashboard,
        authToken,
        getAuthHeaders,
        triggerSecretEntry,
        login,
        logout,
        closeLoginModal,
        exitSecretPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
