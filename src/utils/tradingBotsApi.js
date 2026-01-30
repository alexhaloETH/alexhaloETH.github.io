/**
 * Trading Bots API Service
 *
 * Mock implementation that simulates the botctl commands from FreqTradingBot.
 * Designed to be easily replaceable with real API calls.
 *
 * TODO: Replace mock implementations with real API calls to:
 * - POST /api/system/terminal with command labels
 * - Or direct HTTP calls to botctl control server
 */

// TODO: Import when connecting to real API
// import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Reserved for future real API implementation
void API_BASE_URL;

// Simulated network delay for realistic UX
const MOCK_DELAY = 600;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_BOTS = [
  {
    id: 'eth_momentum',
    name: 'ETH Momentum',
    strategy: 'MomentumStrategy',
    status: 'running',
    dryRun: false,
    pairs: ['ETH/USDT', 'ETH/BTC'],
    wallet: 5000,
    allocation: { 'ETH/USDT': 60, 'ETH/BTC': 40 },
    cap: 10000,
    stats: {
      totalProfit: 1247.83,
      profitPercent: 24.96,
      winRate: 68.5,
      totalTrades: 156,
      openTrades: 3,
      avgTradeProfit: 8.0,
      dailyProfit: 42.15,
      weeklyProfit: 287.50,
      monthlyProfit: 1247.83,
    },
    uptime: '14d 6h 32m',
    lastActivity: '2 minutes ago',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'btc_scalper',
    name: 'BTC Scalper',
    strategy: 'ScalperStrategy',
    status: 'running',
    dryRun: false,
    pairs: ['BTC/USDT'],
    wallet: 10000,
    allocation: { 'BTC/USDT': 100 },
    cap: 25000,
    stats: {
      totalProfit: 3456.21,
      profitPercent: 34.56,
      winRate: 72.3,
      totalTrades: 423,
      openTrades: 5,
      avgTradeProfit: 8.17,
      dailyProfit: 156.80,
      weeklyProfit: 892.40,
      monthlyProfit: 3456.21,
    },
    uptime: '28d 12h 15m',
    lastActivity: '30 seconds ago',
    createdAt: '2026-01-02T08:00:00Z',
  },
  {
    id: 'strk_grid',
    name: 'STRK Grid',
    strategy: 'GridStrategy',
    status: 'stopped',
    dryRun: false,
    pairs: ['STRK/USDT'],
    wallet: 2000,
    allocation: { 'STRK/USDT': 100 },
    cap: 5000,
    stats: {
      totalProfit: 156.40,
      profitPercent: 7.82,
      winRate: 54.2,
      totalTrades: 89,
      openTrades: 0,
      avgTradeProfit: 1.76,
      dailyProfit: 0,
      weeklyProfit: 0,
      monthlyProfit: 156.40,
    },
    uptime: '0d 0h 0m',
    lastActivity: '3 days ago',
    createdAt: '2026-01-10T14:20:00Z',
  },
  {
    id: 'sol_dca',
    name: 'SOL DCA',
    strategy: 'DCAStrategy',
    status: 'running',
    dryRun: true,
    pairs: ['SOL/USDT'],
    wallet: 1000,
    allocation: { 'SOL/USDT': 100 },
    cap: 3000,
    stats: {
      totalProfit: 89.50,
      profitPercent: 8.95,
      winRate: 61.8,
      totalTrades: 34,
      openTrades: 1,
      avgTradeProfit: 2.63,
      dailyProfit: 12.30,
      weeklyProfit: 45.20,
      monthlyProfit: 89.50,
    },
    uptime: '7d 3h 45m',
    lastActivity: '15 minutes ago',
    createdAt: '2026-01-23T16:45:00Z',
  },
  {
    id: 'multi_pair',
    name: 'Multi Pair Trend',
    strategy: 'TrendFollowStrategy',
    status: 'error',
    dryRun: false,
    pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AVAX/USDT'],
    wallet: 8000,
    allocation: { 'BTC/USDT': 40, 'ETH/USDT': 30, 'SOL/USDT': 20, 'AVAX/USDT': 10 },
    cap: 20000,
    stats: {
      totalProfit: -234.56,
      profitPercent: -2.93,
      winRate: 42.1,
      totalTrades: 67,
      openTrades: 0,
      avgTradeProfit: -3.50,
      dailyProfit: 0,
      weeklyProfit: -234.56,
      monthlyProfit: -234.56,
    },
    uptime: '0d 0h 0m',
    lastActivity: '1 hour ago',
    errorMessage: 'API connection timeout - Exchange unreachable',
    createdAt: '2026-01-20T09:15:00Z',
  },
];

const MOCK_TRADES = [
  {
    id: 't1',
    botId: 'btc_scalper',
    botName: 'BTC Scalper',
    pair: 'BTC/USDT',
    type: 'long',
    entryPrice: 42150.00,
    exitPrice: 42380.00,
    amount: 0.05,
    profit: 11.50,
    profitPercent: 0.55,
    status: 'closed',
    openTime: '2026-01-30T08:15:00Z',
    closeTime: '2026-01-30T08:45:00Z',
    duration: '30m',
  },
  {
    id: 't2',
    botId: 'eth_momentum',
    botName: 'ETH Momentum',
    pair: 'ETH/USDT',
    type: 'long',
    entryPrice: 2340.50,
    currentPrice: 2365.80,
    amount: 1.2,
    profit: 30.36,
    profitPercent: 1.08,
    status: 'open',
    openTime: '2026-01-30T07:30:00Z',
    closeTime: null,
    duration: '2h 15m',
  },
  {
    id: 't3',
    botId: 'btc_scalper',
    botName: 'BTC Scalper',
    pair: 'BTC/USDT',
    type: 'short',
    entryPrice: 42500.00,
    exitPrice: 42320.00,
    amount: 0.08,
    profit: 14.40,
    profitPercent: 0.42,
    status: 'closed',
    openTime: '2026-01-30T06:00:00Z',
    closeTime: '2026-01-30T07:20:00Z',
    duration: '1h 20m',
  },
  {
    id: 't4',
    botId: 'eth_momentum',
    botName: 'ETH Momentum',
    pair: 'ETH/BTC',
    type: 'long',
    entryPrice: 0.0556,
    currentPrice: 0.0561,
    amount: 15,
    profit: 0.0075,
    profitPercent: 0.90,
    status: 'open',
    openTime: '2026-01-30T05:45:00Z',
    closeTime: null,
    duration: '4h',
  },
  {
    id: 't5',
    botId: 'sol_dca',
    botName: 'SOL DCA',
    pair: 'SOL/USDT',
    type: 'long',
    entryPrice: 98.50,
    currentPrice: 101.20,
    amount: 5,
    profit: 13.50,
    profitPercent: 2.74,
    status: 'open',
    openTime: '2026-01-29T22:00:00Z',
    closeTime: null,
    duration: '11h 45m',
  },
  {
    id: 't6',
    botId: 'btc_scalper',
    botName: 'BTC Scalper',
    pair: 'BTC/USDT',
    type: 'long',
    entryPrice: 42000.00,
    exitPrice: 42150.00,
    amount: 0.1,
    profit: 15.00,
    profitPercent: 0.36,
    status: 'closed',
    openTime: '2026-01-30T04:30:00Z',
    closeTime: '2026-01-30T05:15:00Z',
    duration: '45m',
  },
];

const MOCK_LOGS = {
  eth_momentum: [
    '2026-01-30 09:45:12 | INFO  | Checking for entry signals on ETH/USDT',
    '2026-01-30 09:45:13 | INFO  | Momentum indicator: 0.85 (bullish)',
    '2026-01-30 09:45:14 | INFO  | Position already open, skipping entry',
    '2026-01-30 09:44:12 | INFO  | Heartbeat - Bot running normally',
    '2026-01-30 09:43:45 | INFO  | Price update: ETH/USDT = 2365.80',
  ],
  btc_scalper: [
    '2026-01-30 09:45:30 | INFO  | Scalp opportunity detected',
    '2026-01-30 09:45:31 | INFO  | Opening LONG position at 42380.00',
    '2026-01-30 09:45:32 | INFO  | Order filled: 0.05 BTC @ 42380.00',
    '2026-01-30 09:44:00 | INFO  | Heartbeat - Bot running normally',
    '2026-01-30 09:43:00 | INFO  | Volatility check: within normal range',
  ],
  strk_grid: [
    '2026-01-27 15:30:00 | INFO  | Bot stopped by user',
    '2026-01-27 15:29:55 | INFO  | Closing all open positions',
    '2026-01-27 15:29:50 | INFO  | Grid levels cleared',
  ],
  sol_dca: [
    '2026-01-30 09:30:00 | INFO  | DCA buy executed: 0.5 SOL @ 101.20',
    '2026-01-30 09:29:55 | INFO  | Schedule triggered: weekly DCA',
    '2026-01-30 09:00:00 | INFO  | Heartbeat - Bot running normally',
  ],
  multi_pair: [
    '2026-01-30 08:30:00 | ERROR | API connection timeout',
    '2026-01-30 08:29:55 | WARN  | Retry attempt 3/3 failed',
    '2026-01-30 08:29:50 | WARN  | Retry attempt 2/3 failed',
    '2026-01-30 08:29:45 | WARN  | Retry attempt 1/3 failed',
    '2026-01-30 08:29:40 | ERROR | Exchange unreachable: connection refused',
  ],
};

// ============================================================================
// INTERNAL STATE (simulates server state)
// ============================================================================

let botsState = JSON.parse(JSON.stringify(MOCK_BOTS));
let tradesState = JSON.parse(JSON.stringify(MOCK_TRADES));

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * List all bots with their current status
 * Equivalent to: botctl list
 */
export async function listBots() {
  await delay(MOCK_DELAY);

  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/api/system/terminal`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ command: 'tradebot_list' }),
  // });
  // const data = await response.json();
  // return parseBotListOutput(data.output);

  return [...botsState];
}

/**
 * Get detailed status of all bots (dashboard view)
 * Equivalent to: botctl status
 */
export async function getBotsStatus() {
  await delay(MOCK_DELAY);

  const running = botsState.filter(b => b.status === 'running').length;
  const stopped = botsState.filter(b => b.status === 'stopped').length;
  const error = botsState.filter(b => b.status === 'error').length;

  const totalProfit = botsState.reduce((sum, b) => sum + b.stats.totalProfit, 0);
  const totalWallet = botsState.reduce((sum, b) => sum + b.wallet, 0);
  const totalTrades = botsState.reduce((sum, b) => sum + b.stats.totalTrades, 0);
  const openTrades = botsState.reduce((sum, b) => sum + b.stats.openTrades, 0);

  return {
    bots: {
      total: botsState.length,
      running,
      stopped,
      error,
    },
    performance: {
      totalProfit,
      profitPercent: totalWallet > 0 ? (totalProfit / totalWallet) * 100 : 0,
      totalTrades,
      openTrades,
    },
    wallet: {
      total: totalWallet,
      allocated: botsState.filter(b => b.status === 'running').reduce((sum, b) => sum + b.wallet, 0),
    },
  };
}

/**
 * Get a single bot by ID
 * Equivalent to: botctl status <bot>
 */
export async function getBot(botId) {
  await delay(MOCK_DELAY / 2);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  return { ...bot };
}

/**
 * Start a bot
 * Equivalent to: botctl start <bot>
 */
export async function startBot(botId) {
  await delay(MOCK_DELAY);

  // TODO: Replace with real API call
  // const response = await fetch(`${API_BASE_URL}/api/system/terminal`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify({ command: `tradebot_start_${botId}` }),
  // });

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  if (bot.status === 'running') {
    throw new Error(`Bot ${bot.name} is already running`);
  }

  bot.status = 'running';
  bot.lastActivity = 'just now';
  bot.uptime = '0d 0h 0m';
  delete bot.errorMessage;

  return { success: true, message: `Bot ${bot.name} started successfully` };
}

/**
 * Stop a bot
 * Equivalent to: botctl stop <bot>
 */
export async function stopBot(botId) {
  await delay(MOCK_DELAY);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  if (bot.status === 'stopped') {
    throw new Error(`Bot ${bot.name} is already stopped`);
  }

  bot.status = 'stopped';
  bot.lastActivity = 'just now';
  bot.uptime = '0d 0h 0m';
  bot.stats.openTrades = 0;
  delete bot.errorMessage;

  return { success: true, message: `Bot ${bot.name} stopped successfully` };
}

/**
 * Restart a bot
 * Equivalent to: botctl restart <bot>
 */
export async function restartBot(botId) {
  await delay(MOCK_DELAY * 1.5);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  bot.status = 'running';
  bot.lastActivity = 'just now';
  bot.uptime = '0d 0h 0m';
  delete bot.errorMessage;

  return { success: true, message: `Bot ${bot.name} restarted successfully` };
}

/**
 * Start all bots
 * Equivalent to: botctl start all
 */
export async function startAllBots() {
  await delay(MOCK_DELAY * 2);

  let started = 0;
  botsState.forEach(bot => {
    if (bot.status !== 'running') {
      bot.status = 'running';
      bot.lastActivity = 'just now';
      bot.uptime = '0d 0h 0m';
      delete bot.errorMessage;
      started++;
    }
  });

  return { success: true, message: `Started ${started} bot(s)` };
}

/**
 * Stop all bots
 * Equivalent to: botctl stop all
 */
export async function stopAllBots() {
  await delay(MOCK_DELAY * 2);

  let stopped = 0;
  botsState.forEach(bot => {
    if (bot.status === 'running') {
      bot.status = 'stopped';
      bot.lastActivity = 'just now';
      bot.uptime = '0d 0h 0m';
      bot.stats.openTrades = 0;
      stopped++;
    }
  });

  return { success: true, message: `Stopped ${stopped} bot(s)` };
}

/**
 * Delete a bot
 * Equivalent to: botctl delete <bot>
 */
export async function deleteBot(botId) {
  await delay(MOCK_DELAY);

  const index = botsState.findIndex(b => b.id === botId);
  if (index === -1) {
    throw new Error(`Bot not found: ${botId}`);
  }

  const bot = botsState[index];
  if (bot.status === 'running') {
    throw new Error(`Cannot delete running bot. Stop it first.`);
  }

  botsState.splice(index, 1);
  tradesState = tradesState.filter(t => t.botId !== botId);

  return { success: true, message: `Bot ${bot.name} deleted successfully` };
}

/**
 * Get bot logs
 * Equivalent to: botctl logs <bot>
 */
export async function getBotLogs(botId, lines = 50) {
  await delay(MOCK_DELAY / 2);

  const logs = MOCK_LOGS[botId];
  if (!logs) {
    return [];
  }

  return logs.slice(0, lines);
}

/**
 * Get trades for a bot or all bots
 * Equivalent to: botctl trades <bot|all>
 */
export async function getTrades(botId = null) {
  await delay(MOCK_DELAY);

  if (botId) {
    return tradesState.filter(t => t.botId === botId);
  }

  return [...tradesState];
}

/**
 * Get bot pairs
 * Equivalent to: botctl pairs <bot>
 */
export async function getBotPairs(botId) {
  await delay(MOCK_DELAY / 2);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  return bot.pairs;
}

/**
 * Update bot pairs
 * Equivalent to: botctl pairs <bot> <pairs...>
 */
export async function updateBotPairs(botId, pairs) {
  await delay(MOCK_DELAY);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  bot.pairs = pairs;

  return { success: true, message: `Updated pairs for ${bot.name}` };
}

/**
 * Get bot wallet
 * Equivalent to: botctl wallet <bot>
 */
export async function getBotWallet(botId) {
  await delay(MOCK_DELAY / 2);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  return { wallet: bot.wallet, cap: bot.cap };
}

/**
 * Update bot wallet
 * Equivalent to: botctl wallet <bot> <amount>
 */
export async function updateBotWallet(botId, amount) {
  await delay(MOCK_DELAY);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  bot.wallet = amount;

  return { success: true, message: `Updated wallet for ${bot.name} to $${amount}` };
}

/**
 * Update bot allocation
 * Equivalent to: botctl alloc <bot> <PAIR=PERCENT ...>
 */
export async function updateBotAllocation(botId, allocation) {
  await delay(MOCK_DELAY);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  bot.allocation = allocation;

  return { success: true, message: `Updated allocation for ${bot.name}` };
}

/**
 * Update bot cap
 * Equivalent to: botctl cap <bot> <amount>
 */
export async function updateBotCap(botId, cap) {
  await delay(MOCK_DELAY);

  const bot = botsState.find(b => b.id === botId);
  if (!bot) {
    throw new Error(`Bot not found: ${botId}`);
  }

  bot.cap = cap;

  return { success: true, message: `Updated cap for ${bot.name} to $${cap}` };
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

/**
 * Reset mock state (for testing)
 */
export function resetMockState() {
  botsState = JSON.parse(JSON.stringify(MOCK_BOTS));
  tradesState = JSON.parse(JSON.stringify(MOCK_TRADES));
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
