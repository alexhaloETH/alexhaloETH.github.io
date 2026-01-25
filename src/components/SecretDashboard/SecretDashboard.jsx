import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { DASHBOARD_PAGES } from './SecretDashboard.constants';
import { pageVariants } from './SecretDashboard.animations';
import MainDashboardContent from './components/MainDashboardContent';
import SecretHeader from './components/SecretHeader';
import SystemDashboardContent from './components/SystemDashboardContent';
import './SecretDashboard.css';

function SecretDashboard() {
  const { logout, exitSecretPortal } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);

  const goToPage = (pageNum) => {
    setDirection(pageNum > currentPage ? 1 : -1);
    setCurrentPage(pageNum);
  };

  const availablePages = DASHBOARD_PAGES;

  return (
    <div className="secret-dashboard">
      <SecretHeader
        pages={availablePages}
        currentPage={currentPage}
        onPageChange={goToPage}
        onExit={exitSecretPortal}
        onLogout={logout}
      />

      <main className="secret-content">
        <AnimatePresence mode="wait" custom={direction}>
          {currentPage === 1 && (
            <motion.div
              key="page-1"
              className="dashboard-page"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <MainDashboardContent />
            </motion.div>
          )}

          {currentPage === 2 && (
            <motion.div
              key="page-2"
              className="dashboard-page"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <SystemDashboardContent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default SecretDashboard;
