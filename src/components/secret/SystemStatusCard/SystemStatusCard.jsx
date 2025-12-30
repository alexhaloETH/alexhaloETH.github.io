import { useState, useEffect } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { getSystemStatus } from '../../../utils/systemApi';
import './SystemStatusCard.css';

function SystemStatusCard() {
  const [systemStats, setSystemStats] = useState([
    { id: 1, name: 'CPU', value: '0%', percentage: 0, type: 'default' },
    { id: 2, name: 'RAM', value: '0GB', percentage: 0, type: 'default' },
    { id: 3, name: 'Disk', value: '0%', percentage: 0, type: 'default' },
    { id: 4, name: 'Temp', value: '0°C', percentage: 0, type: 'temp' },
  ]);
  const [uptime, setUptime] = useState('0s');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedIps, setConnectedIps] = useState([]);

  const fetchSystemStatus = async () => {
    try {
      const status = await getSystemStatus();

      setSystemStats([
        {
          id: 1,
          name: 'CPU',
          value: status.cpu_usage.toFixed(0) + '%',
          percentage: status.cpu_usage,
          type: 'default',
        },
        
        {
          id: 2,
          name: 'RAM',
          value: status.ram_used_gb.toFixed(1) + 'GB',
          percentage: status.ram_usage,
          type: 'default',
        },
        {
          id: 3,
          name: 'Disk',
          value: status.disk_usage.toFixed(0) + '%',
          percentage: status.disk_usage,
          type: 'default',
        },
        {
          id: 4,
          name: 'Temp',
          value: status.temperature.toFixed(0) + '°C',
          percentage: Math.min((status.temperature / 100) * 100, 100),
          type: 'temp',
        },
      ]);

      setUptime(status.uptime_formatted);
      setConnectedIps(status.connected_ips || []);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 5000);
    return () => clearInterval(interval);
  }, []);

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
              <div className={'stat-bar ' + stat.type}>
                <div className="stat-fill" style={{ width: stat.percentage + '%' }} />
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
        {connectedIps.length > 0 && (
          <div className="connected-ips">
            <h4 className="ips-title">Recent Connections</h4>
            <div className="ips-list">
              {connectedIps.map((ip, index) => (
                <div key={index} className="ip-item">
                  <span className="ip-dot" />
                  <span className="ip-address">{ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className={'status-dot ' + (isConnected ? 'connected' : 'error')} />
        <span>Uptime: {uptime}</span>
      </div>
    </BaseCard>
  );
}

export default SystemStatusCard;
