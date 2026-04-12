import PanelShell from './PanelShell';

function DailyOpsPanel({ data }) {
  const { daily } = data;

  return (
    <PanelShell eyebrow="Ops" title="Daily">
      {!daily.ok && (
        <div className="pi-empty">
          <strong>Daily data unavailable</strong>
          <span>{daily.error || 'No task data loaded'}</span>
        </div>
      )}

      {daily.ok && (
        <>
          <div className="pi-metric-grid">
            <div className="pi-metric">
              <span>Open</span>
              <strong>{daily.openTasks}</strong>
            </div>
            <div className="pi-metric">
              <span>Shopping</span>
              <strong>{daily.uncheckedShopping}</strong>
            </div>
          </div>

          <div className="pi-focus-card">
            <span>Focus</span>
            <strong>{daily.highPriorityTask?.text || 'No priority task'}</strong>
            <small>{daily.highPriorityTask?.dueDate || 'Tasks clear'}</small>
          </div>

          <div className="pi-mini-section">
            <span>Mission</span>
            <strong>{daily.topMission?.name || 'No mission active'}</strong>
          </div>
        </>
      )}
    </PanelShell>
  );
}

export default DailyOpsPanel;
