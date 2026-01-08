function SecurityModeSelector({ securityMode, onChange }) {
  return (
    <div className="automation-section">
      <h4 className="section-label">Security Mode</h4>
      <div className="mode-selector">
        <button
          className={`mode-btn ${securityMode === 'home' ? 'active' : ''}`}
          onClick={() => onChange('home')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>Home</span>
        </button>
        <button
          className={`mode-btn ${securityMode === 'away' ? 'active' : ''}`}
          onClick={() => onChange('away')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Away</span>
        </button>
        <button
          className={`mode-btn ${securityMode === 'sleep' ? 'active' : ''}`}
          onClick={() => onChange('sleep')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span>Sleep</span>
        </button>
      </div>
    </div>
  );
}

export default SecurityModeSelector;
