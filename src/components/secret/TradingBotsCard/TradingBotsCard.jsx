import { useState, useEffect } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { getPrivacyMode, setPrivacyMode, formatMoney, formatPercentage } from '../../../utils/privacy';
import './TradingBotsCard.css';

const timePeriods = ['1d', '8h', '7d', '1M'];

// Mock data with different stats per time period
const botsData = [
  {
    id: 1,
    name: 'ETH/USDT Bot',
    status: 'running',
    stats: {
      '1d': { profit: 15.30, change: 0.8 },
      '8h': { profit: 5.20, change: 0.3 },
      '7d': { profit: 124.50, change: 2.4 },
      '1m': { profit: 487.20, change: 9.1 }
    }
  },
  {
    id: 2,
    name: 'BTC Scalper',
    status: 'paused',
    stats: {
      '1d': { profit: 0, change: 0 },
      '8h': { profit: 0, change: 0 },
      '7d': { profit: 0, change: 0 },
      '1M': { profit: 0, change: 0 }
    }
  },
  {
    id: 3,
    name: 'STRK Grid',
    status: 'running',
    stats: {
      '1d': { profit: 8.50, change: 1.2 },
      '8h': { profit: 3.80, change: 0.5 },
      '7d': { profit: 45.80, change: 5.1 },
      '1M': { profit: 156.40, change: 18.3 }
    }
  },
];

function TradingBotsCard() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPercentage, setShowPercentage] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    setIsPrivate(getPrivacyMode('trading'));
  }, []);

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    setPrivacyMode(newState, 'trading');
  };

  const activeBots = botsData.filter(bot => bot.status === 'running').length;

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
        <div className="bots-controls-wrapper">
          <div className="bots-controls">
            <button
              className={`control-btn ${showPercentage ? 'active' : ''}`}
              onClick={() => setShowPercentage(true)}
            >
              %
            </button>
            <button
              className={`control-btn ${!showPercentage ? 'active' : ''}`}
              onClick={() => setShowPercentage(false)}
            >
              $
            </button>
          </div>
          <div className="time-period-controls">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="bots-grid">
          {botsData.map((bot) => {
            const stats = bot.stats[selectedPeriod];
            const changeType = stats.change > 0 ? 'positive' : stats.change < 0 ? 'negative' : 'neutral';

            return (
              <div key={bot.id} className="bot-item">
                <div className="bot-info">
                  <span className="bot-name">{bot.name}</span>
                  <span className={`bot-status ${bot.status}`}>{bot.status}</span>
                </div>
                <div className="bot-stats">
                  <span className={`stat ${changeType}`}>
                    {showPercentage
                      ? formatPercentage(stats.change, isPrivate)
                      : formatMoney(stats.profit, isPrivate)
                    }
                  </span>
                  <span className="stat-label">{selectedPeriod}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-footer">
        <span className="status-dot connected" />
        <span>{activeBots} of {botsData.length} bots active</span>
      </div>
    </BaseCard>
  );
}

export default TradingBotsCard;
