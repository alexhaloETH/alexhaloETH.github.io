import { useState } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { getPrivacyMode, setPrivacyMode, formatMoney } from '../../../utils/privacy';
import { EXCHANGES } from './ExchangeAccountsCard.constants';
import ExchangeFooter from './components/ExchangeFooter';
import ExchangeHeader from './components/ExchangeHeader';
import ExchangeItem from './components/ExchangeItem';
import './ExchangeAccountsCard.css';

function ExchangeAccountsCard() {
  const [expandedExchange, setExpandedExchange] = useState(null);
  const [isPrivate, setIsPrivate] = useState(() => getPrivacyMode('exchange'));

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    setPrivacyMode(newState, 'exchange');
  };

  const connectedCount = EXCHANGES.filter((e) => e.status === 'connected').length;
  const totalBalance = EXCHANGES
    .filter((e) => e.status === 'connected' || e.status === 'pending')
    .reduce((sum, e) => sum + e.balance, 0);

  return (
    <BaseCard className="card exchange-accounts-card">
      <ExchangeHeader
        totalBalanceLabel={formatMoney(totalBalance, isPrivate)}
        isPrivate={isPrivate}
        onTogglePrivacy={togglePrivacy}
      />
      <div className="card-content">
        <div className="exchanges-list">
          {EXCHANGES.map((exchange) => (
            <ExchangeItem
              key={exchange.id}
              exchange={exchange}
              isExpanded={expandedExchange === exchange.id}
              isPrivate={isPrivate}
              onToggle={() =>
                setExpandedExchange(expandedExchange === exchange.id ? null : exchange.id)
              }
            />
          ))}
        </div>
      </div>
      <ExchangeFooter
        connectedCount={connectedCount}
        totalCount={EXCHANGES.length}
      />
    </BaseCard>
  );
}

export default ExchangeAccountsCard;
