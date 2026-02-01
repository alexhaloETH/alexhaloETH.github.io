import { useState, useEffect, useCallback } from 'react';
import {
  listBots,
  getBotsStatus,
  startBot,
  stopBot,
  restartBot,
  startAllBots,
  stopAllBots,
  deleteBot,
  getBotLogs,
} from '../../../utils/tradingBotsApi';

// Validate bot ID to prevent corrupted IDs from causing API errors
const isValidBotId = (id) => id && typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id) && id !== 'unknown';

/**
 * Custom hook for managing trading bots data and operations
 *
 * @param {Function} showNotification - Notification context function
 * @param {Object} access - Permission access object { canRead, canWrite }
 */
export default function useTradingBotsData(showNotification, access = {}) {
  const { canRead = true, canWrite = true } = access;

  // Data state
  const [bots, setBots] = useState([]);
  const [status, setStatus] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [botLogs, setBotLogs] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchData = useCallback(async (showLoader = true) => {
    if (!canRead) return;

    try {
      if (showLoader) setIsLoading(true);
      setError(null);

      const [botsData, statusData] = await Promise.all([
        listBots(),
        getBotsStatus(),
      ]);

      // Filter out bots with invalid IDs
      const validBots = botsData.filter(bot => isValidBotId(bot.id));
      setBots(validBots);
      setStatus(statusData);
    } catch (err) {
      console.error('Failed to fetch bots data:', err);
      setError(err.message || 'Failed to load trading bots');
      showNotification?.({
        title: 'Error',
        message: 'Failed to load trading bots data',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [canRead, showNotification]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData(false);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================================
  // BOT LOGS
  // ============================================================================

  const fetchBotLogs = useCallback(async (botId) => {
    if (!botId || !isValidBotId(botId)) {
      setBotLogs([]);
      return;
    }

    try {
      const logs = await getBotLogs(botId);
      setBotLogs(logs);
    } catch (err) {
      console.error('Failed to fetch bot logs:', err);
      setBotLogs([]);
    }
  }, []);

  // Fetch logs when selected bot changes
  useEffect(() => {
    if (selectedBot) {
      fetchBotLogs(selectedBot.id);
    } else {
      setBotLogs([]);
    }
  }, [selectedBot, fetchBotLogs]);

  // ============================================================================
  // BOT ACTIONS
  // ============================================================================

  const handleStartBot = useCallback(async (botId) => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to control bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress(botId);

      // Optimistic update
      setBots(prev => prev.map(bot =>
        bot.id === botId ? { ...bot, status: 'starting' } : bot
      ));

      const result = await startBot(botId);

      showNotification?.({
        title: 'Bot Started',
        message: result.message,
        type: 'success',
      });

      await refreshData();
    } catch (err) {
      console.error('Failed to start bot:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to start bot',
        type: 'error',
      });

      // Revert optimistic update
      await refreshData();
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, refreshData]);

  const handleStopBot = useCallback(async (botId) => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to control bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress(botId);

      // Optimistic update
      setBots(prev => prev.map(bot =>
        bot.id === botId ? { ...bot, status: 'stopping' } : bot
      ));

      const result = await stopBot(botId);

      showNotification?.({
        title: 'Bot Stopped',
        message: result.message,
        type: 'success',
      });

      await refreshData();
    } catch (err) {
      console.error('Failed to stop bot:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to stop bot',
        type: 'error',
      });

      await refreshData();
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, refreshData]);

  const handleRestartBot = useCallback(async (botId) => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to control bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress(botId);

      setBots(prev => prev.map(bot =>
        bot.id === botId ? { ...bot, status: 'starting' } : bot
      ));

      const result = await restartBot(botId);

      showNotification?.({
        title: 'Bot Restarted',
        message: result.message,
        type: 'success',
      });

      await refreshData();
    } catch (err) {
      console.error('Failed to restart bot:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to restart bot',
        type: 'error',
      });

      await refreshData();
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, refreshData]);

  const handleDeleteBot = useCallback(async (botId) => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to delete bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress(botId);

      const result = await deleteBot(botId);

      showNotification?.({
        title: 'Bot Deleted',
        message: result.message,
        type: 'success',
      });

      // Clear selection if deleted bot was selected
      if (selectedBot?.id === botId) {
        setSelectedBot(null);
      }

      await refreshData();
    } catch (err) {
      console.error('Failed to delete bot:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to delete bot',
        type: 'error',
      });
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, selectedBot, refreshData]);

  const handleStartAll = useCallback(async () => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to control bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress('all');

      const result = await startAllBots();

      showNotification?.({
        title: 'All Bots Started',
        message: result.message,
        type: 'success',
      });

      await refreshData();
    } catch (err) {
      console.error('Failed to start all bots:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to start all bots',
        type: 'error',
      });
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, refreshData]);

  const handleStopAll = useCallback(async () => {
    if (!canWrite) {
      showNotification?.({
        title: 'Access Denied',
        message: 'You do not have permission to control bots',
        type: 'error',
      });
      return;
    }

    try {
      setActionInProgress('all');

      const result = await stopAllBots();

      showNotification?.({
        title: 'All Bots Stopped',
        message: result.message,
        type: 'success',
      });

      await refreshData();
    } catch (err) {
      console.error('Failed to stop all bots:', err);
      showNotification?.({
        title: 'Error',
        message: err.message || 'Failed to stop all bots',
        type: 'error',
      });
    } finally {
      setActionInProgress(null);
    }
  }, [canWrite, showNotification, refreshData]);

  // ============================================================================
  // FILTERING AND SORTING
  // ============================================================================

  const filteredBots = bots
    .filter(bot => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = bot.name.toLowerCase().includes(query);
        const matchesStrategy = bot.strategy.toLowerCase().includes(query);
        const matchesPairs = bot.pairs.some(p => p.toLowerCase().includes(query));
        if (!matchesName && !matchesStrategy && !matchesPairs) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && bot.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'profit':
          comparison = a.stats.totalProfit - b.stats.totalProfit;
          break;
        case 'profitPercent':
          comparison = a.stats.profitPercent - b.stats.profitPercent;
          break;
        case 'trades':
          comparison = a.stats.totalTrades - b.stats.totalTrades;
          break;
        case 'wallet':
          comparison = a.wallet - b.wallet;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    bots: filteredBots,
    allBots: bots,
    status,
    selectedBot,
    botLogs,

    // UI State
    isLoading,
    isRefreshing,
    error,
    actionInProgress,

    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Actions
    refreshData,
    setSelectedBot,
    fetchBotLogs,

    // Bot operations
    handleStartBot,
    handleStopBot,
    handleRestartBot,
    handleDeleteBot,
    handleStartAll,
    handleStopAll,
  };
}
