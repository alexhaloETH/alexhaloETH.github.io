import { motion } from 'framer-motion';
import './SecretBackground.css';

function SecretBackground() {
  return (
    <motion.div
      className="secret-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated grid background */}
      <div className="grid-container">
        <div className="grid-lines horizontal"></div>
        <div className="grid-lines vertical"></div>
      </div>

      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.3}s`,
            '--duration': `${8 + (i % 5) * 2}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
          }}></div>
        ))}
      </div>

      {/* Pulsing gradient orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>

      {/* Scanline effect */}
      <div className="scanline"></div>

      {/* Dark overlay for depth */}
      <div className="dark-overlay"></div>
    </motion.div>
  );
}

export default SecretBackground;
