import BaseCard from '../../BaseCard/BaseCard';
import SystemStats from './components/SystemStats';
import useSystemStatus from './useSystemStatus';
import './SystemStatusCard.css';

function SystemStatusCard() {
  const {
    systemStats,
    uptime,
    isConnected,
    connectedIps,
  } = useSystemStatus();

  return (
    <BaseCard className="card secret-card system-status-card">
      <div className="card-header">
        <div className="card-icon system">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h3>Raspberry Pi Status</h3>
      </div>
      <div className="card-content">
        <SystemStats systemStats={systemStats} connectedIps={connectedIps} />
      </div>
      <div className="card-footer">
        <span className={'status-dot ' + (isConnected ? 'connected' : 'error')} />
        <span>Uptime: {uptime}</span>
      </div>
    </BaseCard>
  );
}

export default SystemStatusCard;
