import { motion } from 'framer-motion';
import './ExitAnimation.css';

function ExitAnimation() {
  return (
    <motion.div
      className="exit-animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="exit-content">
        <div className="exit-spinner">
          <div className="spinner-ring reverse"></div>
          <div className="spinner-ring reverse"></div>
          <div className="spinner-ring reverse"></div>
        </div>
        <div className="exit-bar-container">
          <motion.div
            className="exit-bar"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{
              duration: 1.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          />
        </div>
        <motion.p
          className="exit-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Securing Session...
        </motion.p>
      </div>
    </motion.div>
  );
}

export default ExitAnimation;
