import { STATUS_FILTER_OPTIONS, SORT_OPTIONS } from '../TradingBotsCard.constants';
import BotCard from './BotCard';
import EmptyState from './EmptyState';

function BotsListView({
  bots,
  isPrivate,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onBotClick,
  onStartBot,
  onStopBot,
  onRestartBot,
  onDeleteBot,
  actionInProgress,
  canWrite,
}) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="bots-list-view">
      {/* Search and Filters */}
      <div className="list-controls">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search bots..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => onSearchChange('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button className="sort-order-btn" onClick={toggleSortOrder} title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}>
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

      {/* Bot Cards */}
      {bots.length === 0 ? (
        <EmptyState
          hasFilter={searchQuery || statusFilter !== 'all'}
          onClearFilters={() => {
            onSearchChange('');
            onStatusFilterChange('all');
          }}
        />
      ) : (
        <div className="bots-grid">
          {bots.map(bot => (
            <BotCard
              key={bot.id}
              bot={bot}
              isPrivate={isPrivate}
              onClick={() => onBotClick(bot)}
              onStart={() => onStartBot(bot.id)}
              onStop={() => onStopBot(bot.id)}
              onRestart={() => onRestartBot(bot.id)}
              onDelete={() => onDeleteBot(bot.id)}
              isLoading={actionInProgress === bot.id}
              canWrite={canWrite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BotsListView;
