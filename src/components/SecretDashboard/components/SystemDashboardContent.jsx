import { motion } from 'framer-motion';
import CommandTerminalCard from '../../secret/CommandTerminalCard/CommandTerminalCard';
import HomeAutomationCard from '../../secret/HomeAutomationCard/HomeAutomationCard';
import SystemStatusCard from '../../secret/SystemStatusCard/SystemStatusCard';
import { cardVariants, containerVariants } from '../SecretDashboard.animations';

function SystemDashboardContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-content"
    >
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
          <motion.div variants={cardVariants} className="wide-card-wrapper">
            <HomeAutomationCard />
          </motion.div>
          <motion.div variants={cardVariants}>
            <SystemStatusCard />
          </motion.div>
          <motion.div variants={cardVariants}>
            <CommandTerminalCard />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default SystemDashboardContent;
