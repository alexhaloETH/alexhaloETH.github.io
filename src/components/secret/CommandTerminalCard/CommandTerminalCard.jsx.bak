import { useState, useRef, useEffect } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import './CommandTerminalCard.css';

const commandHistory = [
  { type: 'input', text: 'status bots' },
  { type: 'output', text: 'ETH/USDT Bot: running (+2.4%)\nBTC Scalper: paused\nSTRK Grid: running (+5.1%)' },
  { type: 'input', text: 'lights living-room on' },
  { type: 'output', text: 'Living Room lights turned ON', status: 'success' },
];

const availableCommands = {
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

function CommandTerminalCard() {
  const [history, setHistory] = useState(commandHistory);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const inputHistory = history.filter((h) => h.type === 'input').map((h) => h.text);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!command) return;

    // Add input to history
    const newHistory = [...history, { type: 'input', text: cmd }];

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    const cmdHandler = availableCommands[command];
    if (cmdHandler) {
      const result = cmdHandler.execute(args);
      if (typeof result === 'string') {
        newHistory.push({ type: 'output', text: result });
      } else {
        newHistory.push({ type: 'output', ...result });
      }
    } else {
      newHistory.push({
        type: 'output',
        text: `Command not found: ${command}. Type "help" for available commands.`,
        status: 'error',
      });
    }

    setHistory(newHistory);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(inputHistory[inputHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(inputHistory[inputHistory.length - 1 - newIndex] || '');
      } else {
        setInput('');
      }
    }
  };

  return (
    <BaseCard className="card command-terminal-card">
      <div className="card-header">
        <div className="card-icon terminal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="4,17 10,11 4,5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </div>
        <h3>Command Terminal</h3>
        <div className="terminal-actions">
          <button className="terminal-btn" onClick={() => setHistory([])}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="terminal-output" ref={outputRef} onClick={() => inputRef.current?.focus()}>
        {history.map((entry, index) => (
          <div key={index} className={`terminal-line ${entry.type} ${entry.status || ''}`}>
            {entry.type === 'input' ? (
              <>
                <span className="prompt">$</span>
                <span className="command">{entry.text}</span>
              </>
            ) : (
              <pre className="output">{entry.text}</pre>
            )}
          </div>
        ))}
      </div>
      <form className="terminal-input-form" onSubmit={handleSubmit}>
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="terminal-input"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </BaseCard>
  );
}

export default CommandTerminalCard;
