import { motion } from 'framer-motion';
import PantryCard from '../../secret/PantryCard/PantryCard';
import TasksCard from '../../secret/TasksCard/TasksCard';
import TripsCard from '../../secret/TripsCard/TripsCard';
import LockedCard from '../../LockedCard/LockedCard';
import { cardVariants, containerVariants } from '../SecretDashboard.animations';
import { useAuth } from '../../../contexts/AuthContext';

function MainDashboardContent() {
  const { canRead } = useAuth();
  const showTasks = canRead('tasks') || canRead('notes') || canRead('missions');
  const showPantry = canRead('pantry') || canRead('recipes') || canRead('shopping');
  const showTrips = canRead('trips');

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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Daily Ops
        </h2>
        <div className="section-grid daily-grid">
          <motion.div variants={cardVariants}>
            <LockedCard isLocked={!showTasks}>
              <TasksCard />
            </LockedCard>
          </motion.div>
          <motion.div variants={cardVariants}>
            <LockedCard isLocked={!showPantry}>
              <PantryCard />
            </LockedCard>
          </motion.div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Trips Journal
        </h2>
        <div className="section-grid tracker-grid">
          <motion.div variants={cardVariants} className="wide-card-wrapper">
            <LockedCard isLocked={!showTrips}>
              <TripsCard />
            </LockedCard>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default MainDashboardContent;
