import { motion } from 'framer-motion';
import HomeAutomationCard from '../secret/HomeAutomationCard/HomeAutomationCard';
import PantryCard from '../secret/PantryCard/PantryCard';
import TradingBotsCard from '../secret/TradingBotsCard/TradingBotsCard';
import QuickActionsCard from '../secret/QuickActionsCard/QuickActionsCard';
import SystemStatusCard from '../secret/SystemStatusCard/SystemStatusCard';
import { useAuth } from '../../contexts/AuthContext';
import './SecretDashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SecretDashboard() {
  const { logout, exitSecretPortal } = useAuth();

  return (
    <div className="secret-dashboard">
      <header className="secret-header">
        <div className="secret-header-left">
          <span className="secret-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure Mode
          </span>
          <span className="secret-title">Command Center</span>
        </div>
        <div className="secret-header-right">
          <button className="secret-btn" onClick={exitSecretPortal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Portfolio</span>
          </button>
          <button className="secret-btn logout" onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <motion.main
        className="secret-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Home Automation Card */}
        <motion.div variants={cardVariants}>
          <HomeAutomationCard />
        </motion.div>

        {/* Kitchen Hub Card - Pantry, Recipes, Shopping */}
        <motion.div variants={cardVariants} className="pantry-card-wrapper">
          <PantryCard />
        </motion.div>

        {/* Trading Bots Status Card */}
        <motion.div variants={cardVariants} className="wide-card-wrapper">
          <TradingBotsCard />
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div variants={cardVariants}>
          <QuickActionsCard />
        </motion.div>

        {/* System Status Card */}
        <motion.div variants={cardVariants}>
          <SystemStatusCard />
        </motion.div>
      </motion.main>
    </div>
  );
}

export default SecretDashboard;
