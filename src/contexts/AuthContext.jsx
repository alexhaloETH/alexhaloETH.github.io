import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock password for development - in production this will be verified by backend
const MOCK_PASSWORD = 'demo123';

export function AuthProvider({ children, showNotification }) {
  const [showSecretPortal, setShowSecretPortal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isExitingDashboard, setIsExitingDashboard] = useState(false);

  const triggerSecretEntry = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const login = useCallback((password) => {
    // Mock authentication - replace with real API call later
    if (password === MOCK_PASSWORD) {
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
    }
    return { success: false, error: 'Invalid password' };
  }, [showNotification]);

  const logout = useCallback(() => {
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
    setIsExitingDashboard(true);

    // Show exit animation for 1.5 seconds before closing portal
    setTimeout(() => {
      setShowSecretPortal(false);
      setIsLoadingDashboard(false);
      setIsExitingDashboard(false);
    }, 1500);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        showSecretPortal,
        showLoginModal,
        isLoadingDashboard,
        isExitingDashboard,
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
