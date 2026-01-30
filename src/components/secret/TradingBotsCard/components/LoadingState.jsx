function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      </div>
      <span className="loading-text">Loading trading bots...</span>
    </div>
  );
}

export default LoadingState;
