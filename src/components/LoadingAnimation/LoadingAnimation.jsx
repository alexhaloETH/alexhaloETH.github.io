import { motion } from 'framer-motion';
import './LoadingAnimation.css';

function LoadingAnimation() {
  return (
    <motion.div
      className="loading-animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-bar-container">
          <motion.div
            className="loading-bar"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          />
        </div>
        <motion.p
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Accessing Secure Dashboard...
        </motion.p>
      </div>
    </motion.div>
  );
}

export default LoadingAnimation;
