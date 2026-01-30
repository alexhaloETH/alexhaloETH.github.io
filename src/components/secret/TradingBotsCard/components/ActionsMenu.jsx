import { useEffect, useRef } from 'react';

function ActionsMenu({ bot, onAction, onClose }) {
  const menuRef = useRef(null);

  const isRunning = bot.status === 'running';
  const isStopped = bot.status === 'stopped';
  const isError = bot.status === 'error';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action) => (e) => {
    e.stopPropagation();
    onAction(action);
  };

  return (
    <div className="actions-menu" ref={menuRef}>
      {/* Start */}
      {(isStopped || isError) && (
        <button className="menu-item success" onClick={handleAction('start')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Bot
        </button>
      )}

      {/* Stop */}
      {isRunning && (
        <button className="menu-item warning" onClick={handleAction('stop')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
          Stop Bot
        </button>
      )}

      {/* Restart */}
      {isRunning && (
        <button className="menu-item info" onClick={handleAction('restart')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Restart Bot
        </button>
      )}

      <div className="menu-divider" />

      {/* View Details */}
      <button className="menu-item" onClick={handleAction('details')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        View Details
      </button>

      {/* View Logs */}
      <button className="menu-item" onClick={handleAction('logs')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
        View Logs
      </button>

      <div className="menu-divider" />

      {/* Delete */}
      <button
        className="menu-item danger"
        onClick={handleAction('delete')}
        disabled={isRunning}
        title={isRunning ? 'Stop the bot first' : 'Delete bot'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        Delete Bot
      </button>
    </div>
  );
}

export default ActionsMenu;
