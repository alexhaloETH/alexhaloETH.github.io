import PanelShell from './PanelShell';

function AlertsPanel({ alerts }) {
  const primary = alerts[0];

  return (
    <PanelShell
      eyebrow={primary?.severity === 'critical' ? 'Critical' : 'Attention'}
      title={primary?.title || 'Alerts'}
      tone={primary?.severity === 'critical' ? 'critical' : 'warning'}
    >
      {alerts.length === 0 ? (
        <div className="pi-empty">
          <strong>No alerts</strong>
          <span>Everything looks calm.</span>
        </div>
      ) : (
        <>
          <div className="pi-alert-primary">
            <strong>{primary.message}</strong>
            <span>{primary.detail}</span>
          </div>

          {alerts.length > 1 && (
            <div className="pi-list compact">
              {alerts.slice(1, 4).map((alert) => (
                <div key={alert.id} className={`pi-list-item ${alert.severity}`}>
                  <strong>{alert.title}</strong>
                  <span>{alert.source}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PanelShell>
  );
}

export default AlertsPanel;
