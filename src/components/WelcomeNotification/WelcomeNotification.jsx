import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './WelcomeNotification.css';

function WelcomeNotification({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <motion.div
      className="welcome-notification"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
    >
      <div className="welcome-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <div className="welcome-content">
        <div className="welcome-header">
          <span className="welcome-title">Access Granted</span>
          <span className="welcome-time">{timeString}</span>
        </div>
        <p className="welcome-message">Welcome back to Command Center</p>
      </div>
      <button className="welcome-close" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </motion.div>
  );
}

export default WelcomeNotification;
