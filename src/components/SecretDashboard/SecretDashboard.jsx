import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { DASHBOARD_PAGES } from './SecretDashboard.constants';
import { pageVariants } from './SecretDashboard.animations';
import MainDashboardContent from './components/MainDashboardContent';
import SecretHeader from './components/SecretHeader';
import SystemDashboardContent from './components/SystemDashboardContent';
import './SecretDashboard.css';

function SecretDashboard() {
  const { logout, exitSecretPortal, canRead } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);

  const goToPage = (pageNum) => {
    setDirection(pageNum > currentPage ? 1 : -1);
    setCurrentPage(pageNum);
  };

  const availablePages = useMemo(() => {
    const canAccessMain = canRead('finance')
      || canRead('tasks')
      || canRead('notes')
      || canRead('missions')
      || canRead('pantry')
      || canRead('recipes')
      || canRead('shopping');
    const canAccessSystem = canRead('system') || canRead('automation');

    return DASHBOARD_PAGES.filter((page) => {
      if (page.id === 1) return canAccessMain;
      if (page.id === 2) return canAccessSystem;
      return false;
    });
  }, [canRead]);

  useEffect(() => {
    if (availablePages.length === 0) {
      return;
    }
    if (!availablePages.some((page) => page.id === currentPage)) {
      setCurrentPage(availablePages[0].id);
    }
  }, [availablePages, currentPage]);

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
