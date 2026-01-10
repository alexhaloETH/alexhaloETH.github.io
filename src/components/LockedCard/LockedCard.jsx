import BaseCard from '../BaseCard/BaseCard';
import './LockedCard.css';

function LockedCard({ children, isLocked }) {
  if (!isLocked) {
    return children;
  }

  // Render a placeholder card with blur overlay instead of mounting the real component
  return (
    <div className="locked-card-wrapper">
      <BaseCard className="card secret-card locked-placeholder">
        <div className="card-header">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Restricted</h3>
        </div>
        <div className="card-content placeholder-content">
          <div className="placeholder-line"></div>
          <div className="placeholder-line short"></div>
          <div className="placeholder-line"></div>
          <div className="placeholder-line medium"></div>
        </div>
      </BaseCard>
      <div className="locked-overlay">
        <div className="lock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="lock-message">Restricted Access</p>
      </div>
    </div>
  );
}

export default LockedCard;
