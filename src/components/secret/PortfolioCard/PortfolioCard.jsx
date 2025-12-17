import BaseCard from '../../BaseCard/BaseCard';
import './PortfolioCard.css';

// Mock data - will be replaced with real API data from Bybit/KuCoin/eToro
const portfolioData = {
  totalValue: 12847.52,
  totalChange: 3.24,
  changeType: 'positive',
  assets: [
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.125, value: 5234.50, change: 2.1, allocation: 40.7 },
    { symbol: 'ETH', name: 'Ethereum', amount: 1.85, value: 3456.20, change: 4.5, allocation: 26.9 },
    { symbol: 'STRK', name: 'Starknet', amount: 2500, value: 2125.00, change: -1.2, allocation: 16.5 },
    { symbol: 'SOL', name: 'Solana', amount: 12.5, value: 1287.50, change: 5.8, allocation: 10.0 },
    { symbol: 'USDT', name: 'Tether', amount: 744.32, value: 744.32, change: 0, allocation: 5.8 },
  ],
};

function PortfolioCard() {
  return (
    <BaseCard className="card portfolio-card">
      <div className="card-header">
        <div className="card-icon portfolio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
        </div>
        <div className="header-content">
          <h3>Portfolio</h3>
          <div className="portfolio-total">
            <span className="total-value">${portfolioData.totalValue.toLocaleString()}</span>
            <span className={`total-change ${portfolioData.changeType}`}>
              {portfolioData.changeType === 'positive' ? '+' : ''}{portfolioData.totalChange}%
            </span>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="assets-list">
          {portfolioData.assets.map((asset) => (
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
                <span className={`change ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span className="status-dot connected" />
        <span>Live data • Updated just now</span>
      </div>
    </BaseCard>
  );
}

export default PortfolioCard;
