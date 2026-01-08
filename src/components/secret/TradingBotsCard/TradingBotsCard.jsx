import { useState } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { getPrivacyMode, setPrivacyMode } from '../../../utils/privacy';
import { BOTS_DATA, TIME_PERIODS } from './TradingBotsCard.constants';
import BotsControls from './components/BotsControls';
import BotsList from './components/BotsList';
import './TradingBotsCard.css';

function TradingBotsCard() {
  const [isPrivate, setIsPrivate] = useState(() => getPrivacyMode('trading'));
  const [showPercentage, setShowPercentage] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    setPrivacyMode(newState, 'trading');
  };

  const activeBots = BOTS_DATA.filter(bot => bot.status === 'running').length;

  return (
    <BaseCard className="card secret-card trading-bots-card">
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
        <BotsControls
          showPercentage={showPercentage}
          onToggleMode={setShowPercentage}
          timePeriods={TIME_PERIODS}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />
        <BotsList
          bots={BOTS_DATA}
          selectedPeriod={selectedPeriod}
          showPercentage={showPercentage}
          isPrivate={isPrivate}
        />
      </div>
      <div className="card-footer">
        <span className="status-dot connected" />
        <span>{activeBots} of {BOTS_DATA.length} bots active</span>
      </div>
    </BaseCard>
  );
}

export default TradingBotsCard;
