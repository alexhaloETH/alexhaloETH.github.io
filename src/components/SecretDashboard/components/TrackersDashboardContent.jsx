import { motion } from 'framer-motion';
import GardenCard from '../../secret/GardenCard/GardenCard';
import GymCard from '../../secret/GymCard/GymCard';
import LibraryCard from '../../secret/LibraryCard/LibraryCard';
import LockedCard from '../../LockedCard/LockedCard';
import { cardVariants, containerVariants } from '../SecretDashboard.animations';
import { useAuth } from '../../../contexts/AuthContext';

function TrackersDashboardContent() {
  const { canRead } = useAuth();
  const showGarden = canRead('plants');
  const showGym = canRead('gym');
  const showLibrary = canRead('library');

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
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 16V9" />
            <path d="M12 16V6" />
            <path d="M16 16v-4" />
          </svg>
          Trackers
        </h2>
        <div className="section-grid tracker-grid">
          <motion.div variants={cardVariants}>
            <LockedCard isLocked={!showGarden}>
              <GardenCard />
            </LockedCard>
          </motion.div>
          <motion.div variants={cardVariants}>
            <LockedCard isLocked={!showLibrary}>
              <LibraryCard />
            </LockedCard>
          </motion.div>
          <motion.div variants={cardVariants} className="wide-card-wrapper">
            <LockedCard isLocked={!showGym}>
              <GymCard />
            </LockedCard>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default TrackersDashboardContent;
