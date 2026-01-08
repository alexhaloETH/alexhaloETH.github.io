const COMMAND_HISTORY = [
  { type: 'input', text: 'status bots' },
  { type: 'output', text: 'ETH/USDT Bot: running (+2.4%)\nBTC Scalper: paused\nSTRK Grid: running (+5.1%)' },
  { type: 'input', text: 'lights living-room on' },
  { type: 'output', text: 'Living Room lights turned ON', status: 'success' },
];

const AVAILABLE_COMMANDS = {
  help: {
    description: 'Show available commands',
    execute: () => `Available commands:
  help              - Show this help message
  status <system>   - Check status (bots, lights, servers)
  lights <room> <on|off> - Control lights
  bot <name> <start|stop> - Control trading bots
  clear             - Clear terminal
  sync              - Sync all exchange data
  backup            - Trigger system backup
  notify <message>  - Send notification to phone`,
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
  lights: {
    description: 'Control smart lights',
    execute: (args) => {
      const room = args[0];
      const state = args[1]?.toLowerCase();
      if (!room || !state) return 'Usage: lights <room> <on|off>';
      return { text: `${room} lights turned ${state.toUpperCase()}`, status: 'success' };
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
  sync: {
    description: 'Sync exchange data',
    execute: () => ({ text: 'Syncing all exchange accounts...', status: 'info' }),
  },
  backup: {
    description: 'Trigger backup',
    execute: () => ({ text: 'Backup initiated. ETA: 5 minutes', status: 'info' }),
  },
  notify: {
    description: 'Send notification',
    execute: (args) => {
      const message = args.join(' ');
      if (!message) return 'Usage: notify <message>';
      return { text: `Notification sent: "${message}"`, status: 'success' };
    },
  },
  clear: {
    description: 'Clear terminal',
    execute: () => '__CLEAR__',
  },
};

export { AVAILABLE_COMMANDS, COMMAND_HISTORY };
