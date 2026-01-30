// Tab options
export const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'bots', label: 'Bots' },
  { id: 'trades', label: 'Trades' },
];

// Bot status configurations
export const BOT_STATUS = {
  running: {
    label: 'Running',
    color: 'success',
    icon: 'play',
  },
  stopped: {
    label: 'Stopped',
    color: 'neutral',
    icon: 'stop',
  },
  error: {
    label: 'Error',
    color: 'danger',
    icon: 'alert',
  },
  starting: {
    label: 'Starting',
    color: 'warning',
    icon: 'loading',
  },
  stopping: {
    label: 'Stopping',
    color: 'warning',
    icon: 'loading',
  },
};

// Filter options
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'error', label: 'Error' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'status', label: 'Status' },
  { value: 'profit', label: 'Profit ($)' },
  { value: 'profitPercent', label: 'Profit (%)' },
  { value: 'trades', label: 'Total Trades' },
  { value: 'wallet', label: 'Wallet Size' },
];

// Trade status configurations
export const TRADE_STATUS = {
  open: {
    label: 'Open',
    color: 'info',
  },
  closed: {
    label: 'Closed',
    color: 'neutral',
  },
};

// Trade type configurations
export const TRADE_TYPE = {
  long: {
    label: 'Long',
    color: 'success',
  },
  short: {
    label: 'Short',
    color: 'danger',
  },
};

// Stats card configurations for overview
export const OVERVIEW_STATS = [
  {
    id: 'totalProfit',
    label: 'Total Profit',
    format: 'currency',
    icon: 'trending-up',
  },
  {
    id: 'profitPercent',
    label: 'Return',
    format: 'percent',
    icon: 'percent',
  },
  {
    id: 'totalTrades',
    label: 'Total Trades',
    format: 'number',
    icon: 'activity',
  },
  {
    id: 'openTrades',
    label: 'Open Positions',
    format: 'number',
    icon: 'layers',
  },
];

// Action menu items
export const BOT_ACTIONS = {
  start: {
    label: 'Start Bot',
    icon: 'play',
    color: 'success',
    requiresStopped: true,
  },
  stop: {
    label: 'Stop Bot',
    icon: 'stop',
    color: 'warning',
    requiresRunning: true,
  },
  restart: {
    label: 'Restart Bot',
    icon: 'refresh',
    color: 'info',
    requiresRunning: true,
  },
  logs: {
    label: 'View Logs',
    icon: 'terminal',
    color: 'neutral',
  },
  details: {
    label: 'View Details',
    icon: 'info',
    color: 'neutral',
  },
  delete: {
    label: 'Delete Bot',
    icon: 'trash',
    color: 'danger',
    requiresStopped: true,
    isDestructive: true,
  },
};
