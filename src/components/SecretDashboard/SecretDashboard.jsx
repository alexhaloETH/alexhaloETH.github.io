import { motion } from 'framer-motion';
import BaseCard from '../BaseCard/BaseCard';
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
          <BaseCard className="card secret-card">
            <div className="secret-card-header">
              <div className="secret-card-icon home">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <h3>Home Automation</h3>
            </div>
            <div className="secret-card-content">
              <div className="placeholder-grid">
                <div className="placeholder-item">
                  <span className="placeholder-label">Living Room</span>
                  <div className="placeholder-toggle off" />
                </div>
                <div className="placeholder-item">
                  <span className="placeholder-label">Bedroom</span>
                  <div className="placeholder-toggle on" />
                </div>
                <div className="placeholder-item">
                  <span className="placeholder-label">Kitchen</span>
                  <div className="placeholder-toggle off" />
                </div>
                <div className="placeholder-item">
                  <span className="placeholder-label">Office</span>
                  <div className="placeholder-toggle on" />
                </div>
              </div>
            </div>
            <div className="secret-card-footer">
              <span className="status-dot connected" />
              <span>Mock Data - Backend Not Connected</span>
            </div>
          </BaseCard>
        </motion.div>

        {/* Shopping List Card */}
        <motion.div variants={cardVariants}>
          <BaseCard className="card secret-card">
            <div className="secret-card-header">
              <div className="secret-card-icon shopping">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3>Shopping List</h3>
            </div>
            <div className="secret-card-content">
              <ul className="shopping-list">
                <li className="shopping-item">
                  <div className="checkbox checked" />
                  <span className="done">Milk</span>
                </li>
                <li className="shopping-item">
                  <div className="checkbox" />
                  <span>Bread</span>
                </li>
                <li className="shopping-item">
                  <div className="checkbox" />
                  <span>Eggs</span>
                </li>
                <li className="shopping-item">
                  <div className="checkbox checked" />
                  <span className="done">Coffee</span>
                </li>
                <li className="shopping-item">
                  <div className="checkbox" />
                  <span>Butter</span>
                </li>
              </ul>
            </div>
            <div className="secret-card-footer">
              <span className="status-dot warning" />
              <span>3 items remaining</span>
            </div>
          </BaseCard>
        </motion.div>

        {/* Trading Bots Status Card */}
        <motion.div variants={cardVariants}>
          <BaseCard className="card secret-card wide">
            <div className="secret-card-header">
              <div className="secret-card-icon trading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
                  <polyline points="16,7 22,7 22,13" />
                </svg>
              </div>
              <h3>Trading Bots</h3>
            </div>
            <div className="secret-card-content">
              <div className="bots-grid">
                <div className="bot-item">
                  <div className="bot-info">
                    <span className="bot-name">ETH/USDT Bot</span>
                    <span className="bot-status running">Running</span>
                  </div>
                  <div className="bot-stats">
                    <span className="stat positive">+2.4%</span>
                    <span className="stat-label">24h</span>
                  </div>
                </div>
                <div className="bot-item">
                  <div className="bot-info">
                    <span className="bot-name">BTC Scalper</span>
                    <span className="bot-status paused">Paused</span>
                  </div>
                  <div className="bot-stats">
                    <span className="stat neutral">0.0%</span>
                    <span className="stat-label">24h</span>
                  </div>
                </div>
                <div className="bot-item">
                  <div className="bot-info">
                    <span className="bot-name">STRK Grid</span>
                    <span className="bot-status running">Running</span>
                  </div>
                  <div className="bot-stats">
                    <span className="stat positive">+5.1%</span>
                    <span className="stat-label">24h</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="secret-card-footer">
              <span className="status-dot connected" />
              <span>2 of 3 bots active</span>
            </div>
          </BaseCard>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div variants={cardVariants}>
          <BaseCard className="card secret-card">
            <div className="secret-card-header">
              <div className="secret-card-icon actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                </svg>
              </div>
              <h3>Quick Actions</h3>
            </div>
            <div className="secret-card-content">
              <div className="actions-grid">
                <button className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                    <line x1="12" y1="2" x2="12" y2="12" />
                  </svg>
                  <span>All Lights Off</span>
                </button>
                <button className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17,2 12,7 7,2" />
                  </svg>
                  <span>Night Mode</span>
                </button>
                <button className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </button>
                <button className="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Notifications</span>
                </button>
              </div>
            </div>
          </BaseCard>
        </motion.div>

        {/* System Status Card */}
        <motion.div variants={cardVariants}>
          <BaseCard className="card secret-card">
            <div className="secret-card-header">
              <div className="secret-card-icon system">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>Raspberry Pi Status</h3>
            </div>
            <div className="secret-card-content">
              <div className="system-stats">
                <div className="system-stat">
                  <span className="stat-name">CPU</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: '23%' }} />
                  </div>
                  <span className="stat-value">23%</span>
                </div>
                <div className="system-stat">
                  <span className="stat-name">RAM</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: '58%' }} />
                  </div>
                  <span className="stat-value">4.6GB</span>
                </div>
                <div className="system-stat">
                  <span className="stat-name">Disk</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: '34%' }} />
                  </div>
                  <span className="stat-value">34%</span>
                </div>
                <div className="system-stat">
                  <span className="stat-name">Temp</span>
                  <div className="stat-bar temp">
                    <div className="stat-fill" style={{ width: '45%' }} />
                  </div>
                  <span className="stat-value">45C</span>
                </div>
              </div>
            </div>
            <div className="secret-card-footer">
              <span className="status-dot connected" />
              <span>Uptime: 12d 4h 32m</span>
            </div>
          </BaseCard>
        </motion.div>
      </motion.main>
    </div>
  );
}

export default SecretDashboard;
