import PanelShell from './PanelShell';

function NowPanel({ data }) {
  const nextAction = data.daily.highPriorityTask?.text
    || data.library.currentBook?.title
    || 'All systems normal';

  return (
    <PanelShell eyebrow="Command strip" title="Now">
      <div className="pi-now-hero">
        <span>Today</span>
        <strong>{nextAction}</strong>
      </div>

      <div className="pi-metric-grid">
        <div className="pi-metric">
          <span>Tasks</span>
          <strong>{data.daily.openTasks}</strong>
        </div>
        <div className="pi-metric">
          <span>Pages</span>
          <strong>{data.library.pagesToday}</strong>
        </div>
      </div>
    </PanelShell>
  );
}

export default NowPanel;
