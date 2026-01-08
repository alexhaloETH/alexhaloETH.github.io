function EnvironmentControls({
  brightness,
  temperature,
  volume,
  onBrightnessChange,
  onTemperatureChange,
  onVolumeChange,
}) {
  return (
    <div className="automation-section">
      <h4 className="section-label">Environment</h4>
      <div className="controls-list">
        <div className="control-item">
          <div className="control-header">
            <div className="control-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
              <span className="control-name">Brightness</span>
            </div>
            <span className="control-value">{brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-item">
          <div className="control-header">
            <div className="control-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
              <span className="control-name">Temperature</span>
            </div>
            <span className="control-value">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="16"
            max="30"
            value={temperature}
            onChange={(e) => onTemperatureChange(Number(e.target.value))}
            className="slider temperature"
          />
        </div>

        <div className="control-item">
          <div className="control-header">
            <div className="control-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span className="control-name">Volume</span>
            </div>
            <span className="control-value">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>
    </div>
  );
}

export default EnvironmentControls;
