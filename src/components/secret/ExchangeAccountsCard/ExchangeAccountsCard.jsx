import { useState } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import './ExchangeAccountsCard.css';

// Mock data - will be replaced with real API connections
const exchanges = [
  {
    id: 'bybit',
    name: 'Bybit',
    status: 'connected',
    balance: 4521.32,
    change: 2.8,
    lastSync: '2 min ago',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.075, value: 3141.00, change: 2.1, allocation: 69.5 },
      { symbol: 'ETH', name: 'Ethereum', amount: 0.5, value: 934.00, change: 4.5, allocation: 20.7 },
      { symbol: 'USDT', name: 'Tether', amount: 446.32, value: 446.32, change: 0, allocation: 9.8 },
    ],
  },
  {
    id: 'kucoin',
    name: 'KuCoin',
    status: 'connected',
    balance: 3156.80,
    change: -0.5,
    lastSync: '5 min ago',
    assets: [
      { symbol: 'STRK', name: 'Starknet', amount: 2500, value: 2125.00, change: -1.2, allocation: 67.3 },
      { symbol: 'SOL', name: 'Solana', amount: 5, value: 515.00, change: 5.8, allocation: 16.3 },
      { symbol: 'ETH', name: 'Ethereum', amount: 0.35, value: 516.80, change: 4.5, allocation: 16.4 },
    ],
  },
  {
    id: 'etoro',
    name: 'eToro',
    status: 'disconnected',
    balance: 0,
    change: 0,
    lastSync: 'Not connected',
    assets: [],
  },
  {
    id: 'binance',
    name: 'Binance',
    status: 'pending',
    balance: 5169.40,
    change: 1.2,
    lastSync: 'Syncing...',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.05, value: 2093.50, change: 2.1, allocation: 40.5 },
      { symbol: 'ETH', name: 'Ethereum', amount: 1.0, value: 1868.00, change: 4.5, allocation: 36.1 },
      { symbol: 'SOL', name: 'Solana', amount: 7.5, value: 772.50, change: 5.8, allocation: 14.9 },
      { symbol: 'USDT', name: 'Tether', amount: 435.40, value: 435.40, change: 0, allocation: 8.5 },
    ],
  },
];

const ExchangeIcon = ({ exchange }) => {
  const icons = {
    bybit: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    kucoin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v12M6 12h12" />
      </svg>
    ),
    etoro: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    binance: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L6 8l2 2 4-4 4 4 2-2-6-6zM6 16l6 6 6-6-2-2-4 4-4-4-2 2zM2 12l2-2 2 2-2 2-2-2zM18 12l2-2 2 2-2 2-2-2zM12 9l3 3-3 3-3-3 3-3z" />
      </svg>
    ),
  };
  return icons[exchange] || icons.bybit;
};

function ExchangeAccountsCard() {
  const [expandedExchange, setExpandedExchange] = useState(null);

  const connectedCount = exchanges.filter((e) => e.status === 'connected').length;
  const totalBalance = exchanges
    .filter((e) => e.status === 'connected' || e.status === 'pending')
    .reduce((sum, e) => sum + e.balance, 0);

  return (
    <BaseCard className="card exchange-accounts-card">
      <div className="card-header">
        <div className="card-icon exchange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div className="header-content">
          <h3>Exchange Accounts</h3>
          <span className="header-subtitle">Total: ${totalBalance.toLocaleString()}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="exchanges-list">
          {exchanges.map((exchange) => (
            <div
              key={exchange.id}
              className={`exchange-item ${exchange.status}`}
              onClick={() =>
                setExpandedExchange(expandedExchange === exchange.id ? null : exchange.id)
              }
            >
              <div className="exchange-main">
                <div className={`exchange-icon-wrapper ${exchange.id}`}>
                  <ExchangeIcon exchange={exchange.id} />
                </div>
                <div className="exchange-info">
                  <span className="exchange-name">{exchange.name}</span>
                  <span className={`exchange-status ${exchange.status}`}>
                    {exchange.status === 'connected' && 'Connected'}
                    {exchange.status === 'disconnected' && 'Disconnected'}
                    {exchange.status === 'pending' && 'Syncing...'}
                  </span>
                </div>
                <div className="exchange-balance">
                  {exchange.status !== 'disconnected' ? (
                    <>
                      <span className="balance">${exchange.balance.toLocaleString()}</span>
                      <span className={`change ${exchange.change >= 0 ? 'positive' : 'negative'}`}>
                        {exchange.change >= 0 ? '+' : ''}{exchange.change}%
                      </span>
                    </>
                  ) : (
                    <button className="connect-btn">Connect</button>
                  )}
                </div>
              </div>
              {expandedExchange === exchange.id && exchange.status !== 'disconnected' && (
                <div className="exchange-details">
                  <div className="detail-row">
                    <span>Last Sync</span>
                    <span>{exchange.lastSync}</span>
                  </div>

                  {exchange.assets && exchange.assets.length > 0 && (
                    <div className="assets-breakdown">
                      <div className="assets-header">Portfolio Breakdown</div>
                      <div className="assets-list">
                        {exchange.assets.map((asset) => (
                          <div key={asset.symbol} className="asset-item">
                            <div className="asset-info">
                              <span className="asset-symbol">{asset.symbol}</span>
                              <span className="asset-amount">{asset.amount} {asset.symbol}</span>
                            </div>
                            <div className="asset-allocation">
                              <div className="allocation-bar">
                                <div
                                  className="allocation-fill"
                                  style={{ width: `${asset.allocation}%` }}
                                />
                              </div>
                              <span className="allocation-percent">{asset.allocation}%</span>
                            </div>
                            <div className="asset-value">
                              <span className="value">${asset.value.toLocaleString()}</span>
                              <span className={`asset-change ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                                {asset.change >= 0 ? '+' : ''}{asset.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-actions">
                    <button className="detail-btn">Refresh</button>
                    <button className="detail-btn">Settings</button>
                    <button className="detail-btn danger">Disconnect</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span className={`status-dot ${connectedCount > 0 ? 'connected' : 'warning'}`} />
        <span>{connectedCount} of {exchanges.length} exchanges connected</span>
      </div>
    </BaseCard>
  );
}

export default ExchangeAccountsCard;
