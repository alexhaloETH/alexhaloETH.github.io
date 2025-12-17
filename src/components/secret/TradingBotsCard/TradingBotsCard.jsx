import BaseCard from '../../BaseCard/BaseCard';
import './TradingBotsCard.css';

const bots = [
  { id: 1, name: 'ETH/USDT Bot', status: 'running', change: '+2.4%', changeType: 'positive' },
  { id: 2, name: 'BTC Scalper', status: 'paused', change: '0.0%', changeType: 'neutral' },
  { id: 3, name: 'STRK Grid', status: 'running', change: '+5.1%', changeType: 'positive' },
];

function TradingBotsCard() {
  const activeBots = bots.filter(bot => bot.status === 'running').length;

  return (
    <BaseCard className="card trading-bots-card">
      <div className="card-header">
        <div className="card-icon trading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
            <polyline points="16,7 22,7 22,13" />
          </svg>
        </div>
        <h3>Trading Bots</h3>
      </div>
      <div className="card-content">
        <div className="bots-grid">
          {bots.map((bot) => (
            <div key={bot.id} className="bot-item">
              <div className="bot-info">
                <span className="bot-name">{bot.name}</span>
                <span className={`bot-status ${bot.status}`}>{bot.status}</span>
              </div>
              <div className="bot-stats">
                <span className={`stat ${bot.changeType}`}>{bot.change}</span>
                <span className="stat-label">24h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span className="status-dot connected" />
        <span>{activeBots} of {bots.length} bots active</span>
      </div>
    </BaseCard>
  );
}

export default TradingBotsCard;
