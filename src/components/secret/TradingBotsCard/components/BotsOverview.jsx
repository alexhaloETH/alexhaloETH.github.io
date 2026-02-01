import { formatMoney } from '../../../../utils/privacy';
import { BOT_STATUS } from '../TradingBotsCard.constants';

function StatCard({ label, value, subValue, icon, colorClass }) {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        {subValue && <span className="stat-sub">{subValue}</span>}
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

function QuickBotItem({ bot, onClick }) {
  const statusConfig = BOT_STATUS[bot.status] || BOT_STATUS.stopped;
  const profitClass = bot.stats.totalProfit >= 0 ? 'positive' : 'negative';

  return (
    <button className="quick-bot-item" onClick={() => onClick(bot)}>
      <div className="quick-bot-info">
        <span className="quick-bot-name">{bot.name}</span>
        <span className={`quick-bot-status ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>
      <div className={`quick-bot-profit ${profitClass}`}>
        {bot.stats.totalProfit >= 0 ? '+' : ''}
        {bot.stats.profitPercent.toFixed(1)}%
      </div>
    </button>
  );
}

function BotsOverview({
  status,
  bots,
  isPrivate,
  onBotClick,
  canWrite,
  onStartAll,
  onStopAll,
  actionInProgress,
}) {
  if (!status) return null;

  const { performance, wallet } = status;
  const profitClass = performance.totalProfit >= 0 ? 'positive' : 'negative';

  const runningBots = bots.filter(b => b.status === 'running');
  const stoppedBots = bots.filter(b => b.status === 'stopped');
  const errorBots = bots.filter(b => b.status === 'error');

  return (
    <div className="bots-overview">
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Profit"
          value={formatMoney(performance.totalProfit, isPrivate)}
          subValue={`${performance.totalProfit >= 0 ? '+' : ''}${performance.profitPercent.toFixed(2)}%`}
          colorClass={profitClass}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
        />
        <StatCard
          label="Total Wallet"
          value={formatMoney(wallet.total, isPrivate)}
          subValue={`${formatMoney(wallet.allocated, isPrivate)} active`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
              <circle cx="17" cy="14" r="2" />
            </svg>
          }
        />
        <StatCard
          label="Total Trades"
          value={performance.totalTrades.toLocaleString()}
          subValue={`${performance.openTrades} open`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <StatCard
          label="Active Bots"
          value={`${runningBots.length}/${bots.length}`}
          subValue={errorBots.length > 0 ? `${errorBots.length} error` : 'All healthy'}
          colorClass={errorBots.length > 0 ? 'warning' : ''}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      {canWrite && (
        <div className="quick-actions">
          <button
            className="action-btn start"
            onClick={onStartAll}
            disabled={actionInProgress === 'all' || runningBots.length === bots.length}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start All
          </button>
          <button
            className="action-btn stop"
            onClick={onStopAll}
            disabled={actionInProgress === 'all' || runningBots.length === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            Stop All
          </button>
        </div>
      )}

      {/* Bot Status Summary */}
      <div className="status-summary">
        <h4>Bot Status</h4>
        <div className="status-bars">
          {runningBots.length > 0 && (
            <div className="status-bar-item">
              <span className="status-bar-label">
                <span className="status-dot running" />
                Running
              </span>
              <div className="status-bar">
                <div
                  className="status-bar-fill running"
                  style={{ width: `${(runningBots.length / bots.length) * 100}%` }}
                />
              </div>
              <span className="status-bar-count">{runningBots.length}</span>
            </div>
          )}
          {stoppedBots.length > 0 && (
            <div className="status-bar-item">
              <span className="status-bar-label">
                <span className="status-dot stopped" />
                Stopped
              </span>
              <div className="status-bar">
                <div
                  className="status-bar-fill stopped"
                  style={{ width: `${(stoppedBots.length / bots.length) * 100}%` }}
                />
              </div>
              <span className="status-bar-count">{stoppedBots.length}</span>
            </div>
          )}
          {errorBots.length > 0 && (
            <div className="status-bar-item">
              <span className="status-bar-label">
                <span className="status-dot error" />
                Error
              </span>
              <div className="status-bar">
                <div
                  className="status-bar-fill error"
                  style={{ width: `${(errorBots.length / bots.length) * 100}%` }}
                />
              </div>
              <span className="status-bar-count">{errorBots.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Bot List */}
      <div className="quick-bots">
        <h4>Quick Access</h4>
        <div className="quick-bots-list">
          {bots.slice(0, 5).map(bot => (
            <QuickBotItem key={bot.id} bot={bot} onClick={onBotClick} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default BotsOverview;
