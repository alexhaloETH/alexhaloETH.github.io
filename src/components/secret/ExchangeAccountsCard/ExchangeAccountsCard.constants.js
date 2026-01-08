const EXCHANGES = [
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

export { EXCHANGES };
