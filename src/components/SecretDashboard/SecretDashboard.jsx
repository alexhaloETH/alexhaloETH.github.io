import { motion } from 'framer-motion';
import HomeAutomationCard from '../secret/HomeAutomationCard/HomeAutomationCard';
import PantryCard from '../secret/PantryCard/PantryCard';
import TradingBotsCard from '../secret/TradingBotsCard/TradingBotsCard';
import QuickActionsCard from '../secret/QuickActionsCard/QuickActionsCard';
import SystemStatusCard from '../secret/SystemStatusCard/SystemStatusCard';
import PortfolioCard from '../secret/PortfolioCard/PortfolioCard';
import ExchangeAccountsCard from '../secret/ExchangeAccountsCard/ExchangeAccountsCard';
import TasksCard from '../secret/TasksCard/TasksCard';
import CommandTerminalCard from '../secret/CommandTerminalCard/CommandTerminalCard';
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
        className="secret-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Finance Row */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Finance
          </h2>
          <div className="section-grid">
            <motion.div variants={cardVariants} className="wide-card-wrapper">
              <PortfolioCard />
            </motion.div>
            <motion.div variants={cardVariants}>
              <ExchangeAccountsCard />
            </motion.div>
            <motion.div variants={cardVariants}>
              <TradingBotsCard />
            </motion.div>
          </div>
        </section>

        {/* Life Row */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Life
          </h2>
          <div className="section-grid">
            <motion.div variants={cardVariants} className="wide-card-wrapper">
              <TasksCard />
            </motion.div>
            <motion.div variants={cardVariants}>
              <PantryCard />
            </motion.div>
            <motion.div variants={cardVariants}>
              <QuickActionsCard />
            </motion.div>
          </div>
        </section>

        {/* System Row */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            System
          </h2>
          <div className="section-grid">
            <motion.div variants={cardVariants}>
              <HomeAutomationCard />
            </motion.div>
            <motion.div variants={cardVariants}>
              <SystemStatusCard />
            </motion.div>
            <motion.div variants={cardVariants} className="wide-card-wrapper">
              <CommandTerminalCard />
            </motion.div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}

export default SecretDashboard;
