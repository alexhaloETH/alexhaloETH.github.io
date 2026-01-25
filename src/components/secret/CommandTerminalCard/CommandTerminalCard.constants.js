const COMMAND_HISTORY = [];

const AVAILABLE_COMMANDS = {
  help: {
    description: 'Show available commands',
    execute: () => `Available commands:
  help              - Show this help message
  clear             - Clear terminal
  backup            - Trigger system backup
  trade_bot list         - Trading bot API interaction`,
  },
  status: {
    description: 'Check system status',
    execute: (args) => {
      const system = args[0]?.toLowerCase();
      if (system === 'bots') {
        return 'ETH/USDT Bot: running (+2.4%)\nBTC Scalper: paused\nSTRK Grid: running (+5.1%)';
      }
      if (system === 'lights') {
        return 'Living Room: ON\nBedroom: OFF\nOffice: ON\nKitchen: OFF';
      }
      if (system === 'servers') {
        return 'Main Server: online (CPU: 45%, RAM: 62%)\nBackup Server: standby\nNAS: online (4.2TB free)';
      }
      return 'Usage: status <bots|lights|servers>';
    },
  },
  bot: {
    description: 'Control trading bots',
    execute: (args) => {
      const name = args[0];
      const action = args[1]?.toLowerCase();
      if (!name || !action) return 'Usage: bot <name> <start|stop>';
      if (action === 'start') {
        return { text: `Bot "${name}" started successfully`, status: 'success' };
      }
      if (action === 'stop') {
        return { text: `Bot "${name}" stopped`, status: 'warning' };
      }
      return 'Invalid action. Use start or stop.';
    },
  },
  backup: {
    description: 'Trigger backup',
    execute: () => ({ text: 'Backup initiated. ETA: 5 minutes', status: 'info' }),
  },
  clear: {
    description: 'Clear terminal',
    execute: () => '__CLEAR__',
  },
};

export { AVAILABLE_COMMANDS, COMMAND_HISTORY };
