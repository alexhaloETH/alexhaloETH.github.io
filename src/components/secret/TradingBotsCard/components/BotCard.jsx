import { useState } from 'react';
import { formatMoney } from '../../../../utils/privacy';
import { BOT_STATUS } from '../TradingBotsCard.constants';
import ActionsMenu from './ActionsMenu';

function BotCard({
  bot,
  isPrivate,
  onClick,
  onStart,
  onStop,
  onRestart,
  onDelete,
  isLoading,
  canWrite,
}) {
  const [showActions, setShowActions] = useState(false);

  const statusConfig = BOT_STATUS[bot.status] || BOT_STATUS.stopped;
  const profitClass = bot.stats.totalProfit >= 0 ? 'positive' : 'negative';
  const isRunning = bot.status === 'running';
  const isStopped = bot.status === 'stopped';
  const isError = bot.status === 'error';
  const isTransitioning = bot.status === 'starting' || bot.status === 'stopping';

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleAction = (action) => {
    setShowActions(false);
    switch (action) {
      case 'start':
        onStart();
        break;
      case 'stop':
        onStop();
        break;
      case 'restart':
        onRestart();
        break;
      case 'delete':
        onDelete();
        break;
      case 'details':
        onClick();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`bot-card ${bot.status} ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="bot-card-header">
        <div className="bot-card-title">
          <h4>{bot.name}</h4>
          <span className="bot-strategy">{bot.strategy}</span>
        </div>
        <div className="bot-card-actions">
          <span className={`status-badge ${statusConfig.color}`}>
            {isTransitioning && (
              <svg className="status-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            )}
            {statusConfig.label}
          </span>
          {canWrite && (
            <div className="actions-wrapper">
              <button
                className="actions-btn"
                onClick={handleActionClick}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {showActions && (
                <ActionsMenu
                  bot={bot}
                  onAction={handleAction}
                  onClose={() => setShowActions(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bot-card-stats">
        <div className="stat-row">
          <span className="stat-label">Profit</span>
          <div className={`stat-value-col ${profitClass}`}>
            <span className="stat-main">
              {bot.stats.totalProfit >= 0 ? '+' : ''}
              {formatMoney(bot.stats.totalProfit, isPrivate)}
            </span>
            <span className="stat-sub">
              {bot.stats.totalProfit >= 0 ? '+' : ''}{bot.stats.profitPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="stat-row">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{bot.stats.winRate.toFixed(1)}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Trades</span>
          <div className="stat-value-col">
            <span className="stat-main">{bot.stats.totalTrades}</span>
            {bot.stats.openTrades > 0 && (
              <span className="stat-sub open">{bot.stats.openTrades} open</span>
            )}
          </div>
        </div>
        <div className="stat-row">
          <span className="stat-label">Wallet</span>
          <span className="stat-value">{formatMoney(bot.wallet, isPrivate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bot-card-footer">
        <div className="bot-pairs">
          {bot.pairs.slice(0, 2).map(pair => (
            <span key={pair} className="pair-badge">{pair}</span>
          ))}
          {bot.pairs.length > 2 && (
            <span className="pair-badge more">+{bot.pairs.length - 2}</span>
          )}
        </div>
        <span className="bot-activity">
          {bot.dryRun && <span className="dry-run-badge">DRY RUN</span>}
          {bot.lastActivity}
        </span>
      </div>

      {/* Error Message */}
      {isError && bot.errorMessage && (
        <div className="bot-error-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{bot.errorMessage}</span>
        </div>
      )}

      {/* Quick Actions (visible on hover) */}
      {canWrite && !isLoading && (
        <div className="bot-quick-actions">
          {(isStopped || isError) && (
            <button className="quick-action start" onClick={(e) => { e.stopPropagation(); onStart(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          )}
          {isRunning && (
            <>
              <button className="quick-action stop" onClick={(e) => { e.stopPropagation(); onStop(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              </button>
              <button className="quick-action restart" onClick={(e) => { e.stopPropagation(); onRestart(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="bot-loading-overlay">
          <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default BotCard;
