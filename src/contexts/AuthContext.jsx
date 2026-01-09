import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

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
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('dashboard_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored user:', error);
      }
    }
    const token = localStorage.getItem('dashboard_token');
    return decodeTokenUser(token);
  });

  const triggerSecretEntry = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const login = useCallback(async (username, password) => {
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
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        // Backend rejected the password
        return { success: false, error: data.error || 'Invalid password' };
      }

      // Login successful! Store the JWT token + user info
      const token = data.token;
      const user = data.user || decodeTokenUser(token);
      setAuthToken(token);
      localStorage.setItem('dashboard_token', token);
      setCurrentUser(user);
      if (user) {
        localStorage.setItem('dashboard_user', JSON.stringify(user));
      }

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
    setCurrentUser(null);
    localStorage.removeItem('dashboard_user');

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
    setCurrentUser(null);
    localStorage.removeItem('dashboard_user');

    setIsExitingDashboard(true);

    // Show exit animation for 1.5 seconds before closing portal
    setTimeout(() => {
      setShowSecretPortal(false);
      setIsLoadingDashboard(false);
      setIsExitingDashboard(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!currentUser && authToken) {
      const decoded = decodeTokenUser(authToken);
      if (decoded) {
        setCurrentUser(decoded);
        localStorage.setItem('dashboard_user', JSON.stringify(decoded));
      }
    }
  }, [authToken, currentUser]);

  const permissions = useMemo(() => {
    if (!currentUser) return [];
    return Array.isArray(currentUser.permissions) ? currentUser.permissions : [];
  }, [currentUser]);

  const hasPermission = useCallback((permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return permissions.includes(permission);
  }, [currentUser, permissions]);

  const canRead = useCallback((resource) => {
    return (
      hasPermission(`${resource}:read`)
      || hasPermission(`${resource}:write`)
    );
  }, [hasPermission]);

  const canWrite = useCallback((resource) => {
    return hasPermission(`${resource}:write`);
  }, [hasPermission]);

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
        currentUser,
        permissions,
        hasPermission,
        canRead,
        canWrite,
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

function decodeTokenUser(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const raw = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (!payload) return null;
    return {
      id: payload.user_id ?? payload.id ?? null,
      username: payload.username ?? payload.sub ?? 'user',
      role: payload.role ?? 'user',
      permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
    };
  } catch (error) {
    console.warn('Failed to decode token payload:', error);
    return null;
  }
}
