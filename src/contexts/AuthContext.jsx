import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock password for development - in production this will be verified by backend
const MOCK_PASSWORD = 'demo123';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSecretPortal, setShowSecretPortal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const triggerSecretEntry = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const login = useCallback((password) => {
    // Mock authentication - replace with real API call later
    if (password === MOCK_PASSWORD) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setShowSecretPortal(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid password' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setShowSecretPortal(false);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const exitSecretPortal = useCallback(() => {
    setShowSecretPortal(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        showSecretPortal,
        showLoginModal,
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
