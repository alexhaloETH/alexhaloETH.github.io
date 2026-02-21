/**
 * Trading Bots API Service
 *
 * Real backend integration for the tradebots endpoints.
 */

import { API_ROOT } from './apiClient';

const API_BASE_URL = API_ROOT;

const getAuthToken = () => {
  return localStorage.getItem('dashboard_token');
};

const buildHeaders = (extra = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const apiRequest = async (path, { method = 'GET', body, query } = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || text || `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (payload && payload.success === false) {
    throw new Error(payload.message || payload.error || 'Request failed');
  }

  return payload?.data ?? payload;
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * List all bots with their current status
 */
export async function listBots() {
  const data = await apiRequest('/api/tradebots/bots');
  return Array.isArray(data) ? data : [];
}

/**
 * Get detailed status of all bots (dashboard view)
 */
export async function getBotsStatus() {
  return apiRequest('/api/tradebots/status');
}

/**
 * Get a single bot by ID
 */
export async function getBot(botId) {
  return apiRequest(`/api/tradebots/bots/${botId}`);
}

/**
 * Start a bot
 */
export async function startBot(botId) {
  return apiRequest(`/api/tradebots/bots/${botId}/start`, { method: 'POST' });
}

/**
 * Stop a bot
 */
export async function stopBot(botId) {
  return apiRequest(`/api/tradebots/bots/${botId}/stop`, { method: 'POST' });
}

/**
 * Restart a bot
 */
export async function restartBot(botId) {
  return apiRequest(`/api/tradebots/bots/${botId}/restart`, { method: 'POST' });
}

/**
 * Start all bots
 */
export async function startAllBots() {
  return apiRequest('/api/tradebots/bots/start-all', { method: 'POST' });
}

/**
 * Stop all bots
 */
export async function stopAllBots() {
  return apiRequest('/api/tradebots/bots/stop-all', { method: 'POST' });
}

/**
 * Delete a bot
 */
export async function deleteBot(botId) {
  return apiRequest(`/api/tradebots/bots/${botId}`, { method: 'DELETE' });
}

/**
 * Get bot logs
 */
export async function getBotLogs(botId, lines = 50) {
  const data = await apiRequest(`/api/tradebots/bots/${botId}/logs`, {
    query: { tail: lines },
  });
  return data?.lines || [];
}

/**
 * Get trades for a bot or all bots
 */
export async function getTrades(botId = null) {
  const data = await apiRequest('/api/tradebots/trades', {
    query: { botId: botId || 'all' },
  });
  return Array.isArray(data) ? data : [];
}

/**
 * Get bot pairs
 */
export async function getBotPairs(botId) {
  const data = await apiRequest(`/api/tradebots/bots/${botId}/pairs`);
  return data?.pairs || [];
}

/**
 * Update bot pairs
 */
export async function updateBotPairs(botId, pairs) {
  return apiRequest(`/api/tradebots/bots/${botId}/pairs`, {
    method: 'POST',
    body: { pairs },
  });
}

/**
 * Get bot wallet
 */
export async function getBotWallet(botId) {
  const bot = await getBot(botId);
  return { wallet: bot?.wallet ?? 0, cap: bot?.cap ?? 0 };
}

/**
 * Update bot wallet
 */
export async function updateBotWallet(botId, amount) {
  return apiRequest(`/api/tradebots/bots/${botId}/wallet`, {
    method: 'POST',
    body: { amount },
  });
}

/**
 * Update bot allocation
 */
export async function updateBotAllocation(botId, allocation) {
  return apiRequest(`/api/tradebots/bots/${botId}/allocation`, {
    method: 'POST',
    body: { allocation },
  });
}

/**
 * Update bot cap
 */
export async function updateBotCap(botId, cap) {
  return apiRequest(`/api/tradebots/bots/${botId}/cap`, {
    method: 'POST',
    body: { cap },
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format bot status for display
 */
export function formatBotStatus(status) {
  const statusMap = {
    running: { label: 'Running', color: 'success' },
    stopped: { label: 'Stopped', color: 'neutral' },
    error: { label: 'Error', color: 'danger' },
    starting: { label: 'Starting', color: 'warning' },
    stopping: { label: 'Stopping', color: 'warning' },
  };

  return statusMap[status] || { label: status, color: 'neutral' };
}

/**
 * Format profit value with sign
 */
export function formatProfit(value, isPercent = false) {
  const sign = value >= 0 ? '+' : '';
  if (isPercent) {
    return `${sign}${value.toFixed(2)}%`;
  }
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Get profit color class
 */
export function getProfitClass(value) {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

export default {
  listBots,
  getBotsStatus,
  getBot,
  startBot,
  stopBot,
  restartBot,
  startAllBots,
  stopAllBots,
  deleteBot,
  getBotLogs,
  getTrades,
  getBotPairs,
  updateBotPairs,
  getBotWallet,
  updateBotWallet,
  updateBotAllocation,
  updateBotCap,
  formatBotStatus,
  formatProfit,
  getProfitClass,
};
