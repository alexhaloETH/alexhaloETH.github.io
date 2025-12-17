import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import './LoginModal.css';

function LoginModal() {
  const { showLoginModal, login, closeLoginModal } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showLoginModal && inputRef.current) {
      inputRef.current.focus();
    }
    setPassword('');
    setError('');
  }, [showLoginModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      setPassword('');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="login-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="login-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="login-close" onClick={closeLoginModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="login-header">
              <div className="login-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2>Access Required</h2>
              <p>Enter password to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-wrapper">
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={error ? 'error' : ''}
                  disabled={isLoading}
                />
                {error && <span className="login-error">{error}</span>}
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={!password || isLoading}
              >
                {isLoading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="login-hint">
              <span>Hint: demo123</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
