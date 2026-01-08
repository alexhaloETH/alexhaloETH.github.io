import { formatMoney, formatPercentage } from '../../../../utils/privacy';
import ExchangeIcon from './ExchangeIcon';

function ExchangeItem({ exchange, isExpanded, isPrivate, onToggle }) {
  return (
    <div
      className={`exchange-item ${exchange.status}`}
      onClick={onToggle}
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
              <span className="balance">{formatMoney(exchange.balance, isPrivate)}</span>
              <span className={`change ${exchange.change >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(exchange.change, isPrivate)}
              </span>
            </>
          ) : (
            <button className="connect-btn">Connect</button>
          )}
        </div>
      </div>
      {isExpanded && exchange.status !== 'disconnected' && (
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
                      <span className="asset-amount">{isPrivate ? '****' : asset.amount} {asset.symbol}</span>
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
                      <span className="value">{formatMoney(asset.value, isPrivate)}</span>
                      <span className={`asset-change ${asset.change >= 0 ? 'positive' : 'negative'}`}>
                        {formatPercentage(asset.change, isPrivate)}
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
  );
}

export default ExchangeItem;
