import { useState, useEffect } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { getPrivacyMode, setPrivacyMode } from '../../../utils/privacy';
import './TradingBotsCard.css';

const bots = [
  { id: 1, name: 'ETH/USDT Bot', status: 'running', change: '+2.4%', changeType: 'positive' },
  { id: 2, name: 'BTC Scalper', status: 'paused', change: '0.0%', changeType: 'neutral' },
  { id: 3, name: 'STRK Grid', status: 'running', change: '+5.1%', changeType: 'positive' },
];

function TradingBotsCard() {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setIsPrivate(getPrivacyMode());
  }, []);

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    setPrivacyMode(newState);
  };

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
        <button className="privacy-toggle" onClick={togglePrivacy} title={isPrivate ? 'Show percentages' : 'Hide percentages'}>
          {isPrivate ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
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
                <span className={`stat ${bot.changeType}`}>{isPrivate ? '***%' : bot.change}</span>
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
