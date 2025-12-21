import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
    setNotification({
      title,
      message,
      type,
      duration,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        closeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
