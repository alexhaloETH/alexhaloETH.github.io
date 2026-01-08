function TerminalHeader({ onClear }) {
  return (
    <div className="card-header">
      <div className="card-icon terminal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="4,17 10,11 4,5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      </div>
      <h3>Command Terminal</h3>
      <div className="terminal-actions">
        <button className="terminal-btn" onClick={onClear}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TerminalHeader;
