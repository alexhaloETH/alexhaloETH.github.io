import { motion } from 'framer-motion';
import ExchangeAccountsCard from '../../secret/ExchangeAccountsCard/ExchangeAccountsCard';
import GardenCard from '../../secret/GardenCard/GardenCard';
import PantryCard from '../../secret/PantryCard/PantryCard';
import TasksCard from '../../secret/TasksCard/TasksCard';
import TradingBotsCard from '../../secret/TradingBotsCard/TradingBotsCard';
import LockedCard from '../../LockedCard/LockedCard';
import { cardVariants, containerVariants } from '../SecretDashboard.animations';
import { useAuth } from '../../../contexts/AuthContext';

function MainDashboardContent() {
  const { canRead } = useAuth();
  const showFinance = canRead('finance');
  const showGarden = canRead('plants');
  const showTasks = canRead('tasks') || canRead('notes') || canRead('missions');
  const showPantry = canRead('pantry') || canRead('recipes') || canRead('shopping');

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
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Finance
        </h2>
        <div className="section-grid">
          <motion.div variants={cardVariants} className="wide-card-wrapper">
            <LockedCard isLocked={!showFinance}>
              <ExchangeAccountsCard />
            </LockedCard>
          </motion.div>
          <motion.div variants={cardVariants}>
            <LockedCard isLocked={!showFinance}>
              <TradingBotsCard />
            </LockedCard>
          </motion.div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Life
        </h2>
        <div className="section-grid two-col">
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
          <motion.div variants={cardVariants} className="wide-card-wrapper">
            <LockedCard isLocked={!showGarden}>
              <GardenCard />
            </LockedCard>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default MainDashboardContent;
