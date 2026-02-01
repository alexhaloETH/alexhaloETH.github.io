import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { useNotification } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { getPrivacyMode, setPrivacyMode } from '../../../utils/privacy';
import useTradingBotsData from './useTradingBotsData';
import { TABS } from './TradingBotsCard.constants';
import BotsOverview from './components/BotsOverview';
import BotsListView from './components/BotsListView';
import BotDetailsModal from './components/BotDetailsModal';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import './TradingBotsCard.css';

function TradingBotsCard() {
  const { showNotification } = useNotification();
  const { canRead, canWrite } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isPrivate, setIsPrivate] = useState(() => getPrivacyMode('trading'));

  const canReadBots = canRead('finance');
  const canWriteBots = canWrite('finance');

  const {
    bots,
    allBots,
    status,
    selectedBot,
    botLogs,
    isLoading,
    isRefreshing,
    error,
    actionInProgress,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refreshData,
    setSelectedBot,
    handleStartBot,
    handleStopBot,
    handleRestartBot,
    handleDeleteBot,
    handleStartAll,
    handleStopAll,
  } = useTradingBotsData(showNotification, {
    canRead: canReadBots,
    canWrite: canWriteBots,
  });

  const togglePrivacy = () => {
    const newState = !isPrivate;
    setIsPrivate(newState);
    setPrivacyMode(newState, 'trading');
  };

  const runningBots = allBots.filter(b => b.status === 'running').length;

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={refreshData} />;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <BotsOverview
            status={status}
            bots={allBots}
            isPrivate={isPrivate}
            onBotClick={setSelectedBot}
            canWrite={canWriteBots}
            onStartAll={handleStartAll}
            onStopAll={handleStopAll}
            actionInProgress={actionInProgress}
          />
        );
      case 'bots':
        return (
          <BotsListView
            bots={bots}
            isPrivate={isPrivate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onBotClick={setSelectedBot}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            onRestartBot={handleRestartBot}
            onDeleteBot={handleDeleteBot}
            actionInProgress={actionInProgress}
            canWrite={canWriteBots}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BaseCard className="card secret-card trading-bots-card">
      <div className="card-header">
        <div className="card-icon trading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
            <polyline points="16,7 22,7 22,13" />
          </svg>
        </div>
        <div className="header-content">
          <h3>Trading Bots</h3>
          <span className="header-subtitle">FreqTrade Manager</span>
        </div>
        <div className="header-actions">
          <button
            className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={refreshData}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <button
            className="privacy-toggle"
            onClick={togglePrivacy}
            title={isPrivate ? 'Show values' : 'Hide values'}
          >
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
      </div>

      <div className="tabs-container">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="tab-content"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="card-footer">
        <span className={`status-dot ${runningBots > 0 ? 'connected' : 'disconnected'}`} />
        <span>
          {runningBots} of {allBots.length} bots active
        </span>
      </div>

      <AnimatePresence>
        {selectedBot && (
          <BotDetailsModal
            bot={selectedBot}
            logs={botLogs}
            isPrivate={isPrivate}
            onClose={() => setSelectedBot(null)}
            onStart={handleStartBot}
            onStop={handleStopBot}
            onRestart={handleRestartBot}
            onDelete={handleDeleteBot}
            actionInProgress={actionInProgress}
            canWrite={canWriteBots}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default TradingBotsCard;
