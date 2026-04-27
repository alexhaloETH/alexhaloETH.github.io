import { motion } from 'framer-motion';
import LockedCard from '../../LockedCard/LockedCard';
import ContentBrowser from '../../ContentBrowser/ContentBrowser';
import { cardVariants, containerVariants } from '../SecretDashboard.animations';
import { useAuth } from '../../../contexts/AuthContext';

function VaultDashboardContent() {
  const { canRead } = useAuth();
  const canReadVault = canRead('notes');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-content"
    >
      <section className="dashboard-section vault-dashboard-section">
        <h2 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Private Vault
        </h2>
        <motion.div className="vault-dashboard-panel-wrapper" variants={cardVariants}>
          <LockedCard isLocked={!canReadVault}>
            <div className="vault-dashboard-panel">
              <ContentBrowser />
            </div>
          </LockedCard>
        </motion.div>
      </section>
    </motion.div>
  );
}

export default VaultDashboardContent;
