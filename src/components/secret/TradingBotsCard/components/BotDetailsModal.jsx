import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatMoney } from '../../../../utils/privacy';
import { BOT_STATUS } from '../TradingBotsCard.constants';

function BotDetailsModal({
  bot,
  logs,
  isPrivate,
  onClose,
  onStart,
  onStop,
  onRestart,
  onDelete,
  actionInProgress,
  canWrite,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusConfig = BOT_STATUS[bot.status] || BOT_STATUS.stopped;
  const profitClass = bot.stats.totalProfit >= 0 ? 'positive' : 'negative';
  const isRunning = bot.status === 'running';
  const isStopped = bot.status === 'stopped';
  const isError = bot.status === 'error';
  const isLoading = actionInProgress === bot.id;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(bot.id);
    onClose();
  };

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bot-details-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h3>{bot.name}</h3>
            <span className={`status-badge ${statusConfig.color}`}>{statusConfig.label}</span>
            {bot.dryRun && <span className="dry-run-badge">DRY RUN</span>}
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`modal-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Config
          </button>
          <button
            className={`modal-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              {/* Stats Grid */}
              <div className="detail-stats-grid">
                <div className={`detail-stat ${profitClass}`}>
                  <span className="detail-stat-label">Total Profit</span>
                  <span className="detail-stat-value">
                    {bot.stats.totalProfit >= 0 ? '+' : ''}
                    {formatMoney(bot.stats.totalProfit, isPrivate)}
                  </span>
                  <span className="detail-stat-sub">
                    {bot.stats.totalProfit >= 0 ? '+' : ''}{bot.stats.profitPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-label">Win Rate</span>
                  <span className="detail-stat-value">{bot.stats.winRate.toFixed(1)}%</span>
                  <span className="detail-stat-sub">{bot.stats.totalTrades} trades</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-label">Open Positions</span>
                  <span className="detail-stat-value">{bot.stats.openTrades}</span>
                  <span className="detail-stat-sub">active</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-label">Avg Trade</span>
                  <span className="detail-stat-value">
                    {formatMoney(bot.stats.avgTradeProfit, isPrivate)}
                  </span>
                  <span className="detail-stat-sub">per trade</span>
                </div>
              </div>

              {/* Performance Timeline */}
              <div className="detail-section">
                <h4>Performance</h4>
                <div className="performance-grid">
                  <div className="perf-item">
                    <span className="perf-label">Daily</span>
                    <span className={`perf-value ${bot.stats.dailyProfit >= 0 ? 'positive' : 'negative'}`}>
                      {bot.stats.dailyProfit >= 0 ? '+' : ''}
                      {formatMoney(bot.stats.dailyProfit, isPrivate)}
                    </span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Weekly</span>
                    <span className={`perf-value ${bot.stats.weeklyProfit >= 0 ? 'positive' : 'negative'}`}>
                      {bot.stats.weeklyProfit >= 0 ? '+' : ''}
                      {formatMoney(bot.stats.weeklyProfit, isPrivate)}
                    </span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Monthly</span>
                    <span className={`perf-value ${bot.stats.monthlyProfit >= 0 ? 'positive' : 'negative'}`}>
                      {bot.stats.monthlyProfit >= 0 ? '+' : ''}
                      {formatMoney(bot.stats.monthlyProfit, isPrivate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {isError && bot.errorMessage && (
                <div className="error-banner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{bot.errorMessage}</span>
                </div>
              )}

              {/* Bot Info */}
              <div className="detail-section">
                <h4>Info</h4>
                <div className="info-grid">
                  <div className="info-row">
                    <span className="info-label">Strategy</span>
                    <span className="info-value">{bot.strategy}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Uptime</span>
                    <span className="info-value">{bot.uptime}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Activity</span>
                    <span className="info-value">{bot.lastActivity}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Created</span>
                    <span className="info-value">
                      {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="config-content">
              {/* Wallet & Cap */}
              <div className="detail-section">
                <h4>Wallet</h4>
                <div className="config-grid">
                  <div className="config-item">
                    <span className="config-label">Wallet Size</span>
                    <span className="config-value">{formatMoney(bot.wallet, isPrivate)}</span>
                  </div>
                  <div className="config-item">
                    <span className="config-label">Max Cap</span>
                    <span className="config-value">{formatMoney(bot.cap, isPrivate)}</span>
                  </div>
                </div>
              </div>

              {/* Trading Pairs */}
              <div className="detail-section">
                <h4>Trading Pairs</h4>
                <div className="pairs-list">
                  {bot.pairs.map(pair => (
                    <span key={pair} className="config-pair-badge">{pair}</span>
                  ))}
                </div>
              </div>

              {/* Allocation */}
              <div className="detail-section">
                <h4>Allocation</h4>
                <div className="allocation-list">
                  {Object.entries(bot.allocation).map(([pair, percent]) => (
                    <div key={pair} className="allocation-item">
                      <span className="allocation-pair">{pair}</span>
                      <div className="allocation-bar">
                        <div
                          className="allocation-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="allocation-percent">{percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-content">
              {logs.length === 0 ? (
                <div className="no-logs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                  <span>No logs available</span>
                </div>
              ) : (
                <div className="logs-container">
                  {logs.map((log, index) => {
                    const isError = log.includes('ERROR');
                    const isWarn = log.includes('WARN');
                    const logClass = isError ? 'error' : isWarn ? 'warn' : 'info';

                    return (
                      <div key={index} className={`log-line ${logClass}`}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Footer */}
        {canWrite && (
          <div className="modal-footer">
            {showDeleteConfirm ? (
              <div className="delete-confirm">
                <span>Are you sure you want to delete this bot?</span>
                <div className="confirm-actions">
                  <button className="confirm-btn cancel" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                  <button className="confirm-btn delete" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="action-buttons">
                  {(isStopped || isError) && (
                    <button
                      className="action-btn primary"
                      onClick={() => onStart(bot.id)}
                      disabled={isLoading}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Start
                    </button>
                  )}
                  {isRunning && (
                    <>
                      <button
                        className="action-btn warning"
                        onClick={() => onStop(bot.id)}
                        disabled={isLoading}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="6" width="12" height="12" />
                        </svg>
                        Stop
                      </button>
                      <button
                        className="action-btn secondary"
                        onClick={() => onRestart(bot.id)}
                        disabled={isLoading}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 4v6h-6M1 20v-6h6" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Restart
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isRunning || isLoading}
                  title={isRunning ? 'Stop the bot first' : 'Delete bot'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </>
            )}

            {isLoading && (
              <div className="loading-indicator">
                <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default BotDetailsModal;
