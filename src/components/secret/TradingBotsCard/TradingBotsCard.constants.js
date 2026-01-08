const TIME_PERIODS = ['1h', '8h', '1d', '7d', '1M'];

const BOTS_DATA = [
  {
    id: 1,
    name: 'ETH/USDT Bot',
    status: 'running',
    stats: {
      '1h': { profit: 2.10, change: 0.1 },
      '8h': { profit: 5.20, change: 0.3 },
      '1d': { profit: 15.30, change: 0.8 },
      '7d': { profit: 124.50, change: 2.4 },
      '1M': { profit: 487.20, change: 9.1 }
    }
  },
  {
    id: 2,
    name: 'BTC Scalper',
    status: 'paused',
    stats: {
      '1h': { profit: 0, change: 0 },
      '8h': { profit: 0, change: 0 },
      '1d': { profit: 0, change: 0 },
      '7d': { profit: 0, change: 0 },
      '1M': { profit: 0, change: 0 }
    }
  },
  {
    id: 3,
    name: 'STRK Grid',
    status: 'running',
    stats: {
      '1h': { profit: 1.20, change: 0.2 },
      '8h': { profit: 3.80, change: 0.5 },
      '1d': { profit: 8.50, change: 1.2 },
      '7d': { profit: 45.80, change: 5.1 },
      '1M': { profit: 156.40, change: 18.3 }
    }
  },
];

export { BOTS_DATA, TIME_PERIODS };
