import BaseCard from '../../BaseCard/BaseCard';
import './SystemStatusCard.css';

const systemStats = [
  { id: 1, name: 'CPU', value: '23%', percentage: 23, type: 'default' },
  { id: 2, name: 'RAM', value: '4.6GB', percentage: 58, type: 'default' },
  { id: 3, name: 'Disk', value: '34%', percentage: 34, type: 'default' },
  { id: 4, name: 'Temp', value: '45°C', percentage: 45, type: 'temp' },
];

function SystemStatusCard() {
  return (
    <BaseCard className="card system-status-card">
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
        <div className="system-stats">
          {systemStats.map((stat) => (
            <div key={stat.id} className="system-stat">
              <span className="stat-name">{stat.name}</span>
              <div className={`stat-bar ${stat.type}`}>
                <div className="stat-fill" style={{ width: `${stat.percentage}%` }} />
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span className="status-dot connected" />
        <span>Uptime: 12d 4h 32m</span>
      </div>
    </BaseCard>
  );
}

export default SystemStatusCard;
