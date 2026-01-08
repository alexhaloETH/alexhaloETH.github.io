import { useState, useRef, useEffect } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import './CommandTerminalCard.css';
import { executeTerminalCommand } from '../../../utils/systemApi';
import { AVAILABLE_COMMANDS, COMMAND_HISTORY } from './CommandTerminalCard.constants';
import TerminalHeader from './components/TerminalHeader';
import TerminalInput from './components/TerminalInput';
import TerminalOutput from './components/TerminalOutput';

function CommandTerminalCard() {
  const [history, setHistory] = useState(COMMAND_HISTORY);
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

  const executeCommand = async (cmd) => {
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

    const cmdHandler = AVAILABLE_COMMANDS[command];
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
    // Send command to backend
    try {
      const response = await executeTerminalCommand(cmd);
      console.log('Command sent to backend:', response);
    } catch (error) {
      console.error('Failed to send command to backend:', error);
    }
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
    <BaseCard className="card secret-card command-terminal-card">
      <TerminalHeader onClear={() => setHistory([])} />
      <TerminalOutput
        history={history}
        onFocusInput={() => inputRef.current?.focus()}
        outputRef={outputRef}
      />
      <TerminalInput
        inputRef={inputRef}
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
      />
    </BaseCard>
  );
}

export default CommandTerminalCard;
