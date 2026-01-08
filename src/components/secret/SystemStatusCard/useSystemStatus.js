import { useEffect, useState } from 'react';
import { getSystemStatus } from '../../../utils/systemApi';

const DEFAULT_STATS = [
  { id: 1, name: 'CPU', value: '0%', percentage: 0, type: 'default' },
  { id: 2, name: 'RAM', value: '0GB', percentage: 0, type: 'default' },
  { id: 3, name: 'Disk', value: '0%', percentage: 0, type: 'default' },
  { id: 4, name: 'Temp', value: '0°C', percentage: 0, type: 'temp' },
];

const useSystemStatus = () => {
  const [systemStats, setSystemStats] = useState(DEFAULT_STATS);
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
    } catch (_error) {
      console.error('Failed to fetch system status:', _error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchSystemStatus, 0);
    const interval = setInterval(fetchSystemStatus, 5000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  return {
    systemStats,
    uptime,
    isConnected,
    connectedIps,
  };
};

export default useSystemStatus;
