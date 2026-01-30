import { useState } from 'react';
import { formatMoney, formatPercentage } from '../../../../utils/privacy';

function TradeRow({ trade, isPrivate }) {
  const profitClass = trade.profit >= 0 ? 'positive' : 'negative';
  const isOpen = trade.status === 'open';

  return (
    <div className={`trade-row ${trade.status}`}>
      <div className="trade-cell pair">
        <span className="pair-name">{trade.pair}</span>
        <span className={`trade-type ${trade.type}`}>{trade.type.toUpperCase()}</span>
      </div>
      <div className="trade-cell bot">
        <span>{trade.botName}</span>
      </div>
      <div className="trade-cell entry">
        <span className="price-label">Entry</span>
        <span className="price-value">{formatMoney(trade.entryPrice, isPrivate)}</span>
      </div>
      <div className="trade-cell exit">
        <span className="price-label">{isOpen ? 'Current' : 'Exit'}</span>
        <span className="price-value">
          {formatMoney(isOpen ? trade.currentPrice : trade.exitPrice, isPrivate)}
        </span>
      </div>
      <div className={`trade-cell profit ${profitClass}`}>
        <span className="profit-value">
          {trade.profit >= 0 ? '+' : ''}
          {formatMoney(trade.profit, isPrivate)}
        </span>
        <span className="profit-percent">
          {formatPercentage(trade.profitPercent, isPrivate)}
        </span>
      </div>
      <div className="trade-cell duration">
        <span>{trade.duration}</span>
      </div>
      <div className="trade-cell status">
        <span className={`status-badge ${trade.status}`}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    </div>
  );
}

function TradesView({ trades, openTrades, closedTrades, isPrivate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState('desc');

  const getFilteredTrades = () => {
    let filtered;
    switch (activeTab) {
      case 'open':
        filtered = openTrades;
        break;
      case 'closed':
        filtered = closedTrades;
        break;
      default:
        filtered = trades;
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'time':
          comparison = new Date(a.openTime) - new Date(b.openTime);
          break;
        case 'profit':
          comparison = a.profit - b.profit;
          break;
        case 'pair':
          comparison = a.pair.localeCompare(b.pair);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredTrades = getFilteredTrades();

  const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
  const profitClass = totalProfit >= 0 ? 'positive' : 'negative';

  return (
    <div className="trades-view">
      {/* Trades Header */}
      <div className="trades-header">
        <div className="trades-tabs">
          <button
            className={`trades-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({trades.length})
          </button>
          <button
            className={`trades-tab ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Open ({openTrades.length})
          </button>
          <button
            className={`trades-tab ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed ({closedTrades.length})
          </button>
        </div>

        <div className="trades-summary">
          <span className={`summary-profit ${profitClass}`}>
            Total: {totalProfit >= 0 ? '+' : ''}
            {formatMoney(totalProfit, isPrivate)}
          </span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="trades-controls">
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="time">Time</option>
            <option value="profit">Profit</option>
            <option value="pair">Pair</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sortOrder === 'asc' ? (
                <>
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </>
              ) : (
                <>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Trades Table */}
      {filteredTrades.length === 0 ? (
        <div className="no-trades">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>No trades to display</span>
        </div>
      ) : (
        <div className="trades-table">
          <div className="trades-table-header">
            <div className="header-cell pair">Pair</div>
            <div className="header-cell bot">Bot</div>
            <div className="header-cell entry">Entry</div>
            <div className="header-cell exit">Exit/Current</div>
            <div className="header-cell profit">Profit</div>
            <div className="header-cell duration">Duration</div>
            <div className="header-cell status">Status</div>
          </div>
          <div className="trades-table-body">
            {filteredTrades.map(trade => (
              <TradeRow key={trade.id} trade={trade} isPrivate={isPrivate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TradesView;
