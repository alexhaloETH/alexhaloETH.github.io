function BotsControls({
  showPercentage,
  onToggleMode,
  timePeriods,
  selectedPeriod,
  onSelectPeriod,
}) {
  return (
    <div className="bots-controls-wrapper">
      <div className="bots-controls">
        <button
          className={`control-btn ${showPercentage ? 'active' : ''}`}
          onClick={() => onToggleMode(true)}
        >
          %
        </button>
        <button
          className={`control-btn ${!showPercentage ? 'active' : ''}`}
          onClick={() => onToggleMode(false)}
        >
          $
        </button>
      </div>
      <div className="time-period-controls">
        {timePeriods.map((period) => (
          <button
            key={period}
            className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
            onClick={() => onSelectPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BotsControls;
