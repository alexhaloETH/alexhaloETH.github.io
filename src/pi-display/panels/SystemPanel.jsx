import PanelShell from './PanelShell';
import { formatPercent, formatTemperature, formatUptime } from '../piDisplayUtils';

function SystemPanel({ data }) {
  const { system, health } = data;

  return (
    <PanelShell eyebrow="Pi" title="System" tone={health.apiOk && system.ok ? 'green' : 'warning'}>
      <div className="pi-metric-grid">
        <div className="pi-metric">
          <span>Temp</span>
          <strong>{formatTemperature(system.temperature)}</strong>
        </div>
        <div className="pi-metric">
          <span>CPU</span>
          <strong>{formatPercent(system.cpuUsage)}</strong>
        </div>
        <div className="pi-metric">
          <span>RAM</span>
          <strong>{formatPercent(system.ramUsage)}</strong>
        </div>
        <div className="pi-metric">
          <span>Disk</span>
          <strong>{formatPercent(system.diskUsage)}</strong>
        </div>
      </div>

      <div className="pi-focus-card">
        <span>Uptime</span>
        <strong>{formatUptime(system.uptime)}</strong>
        <small>{health.apiOk ? 'Backend reachable' : health.error}</small>
      </div>
    </PanelShell>
  );
}

export default SystemPanel;
