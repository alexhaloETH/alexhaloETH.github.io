import PanelShell from './PanelShell';
import { pluralize } from '../piDisplayUtils';

function NowPanel({ data }) {
  const nextAction = data.garden.nextWaterPlant
    ? `Water ${data.garden.nextWaterPlant.name}`
    : data.daily.highPriorityTask?.text
      || data.library.currentBook?.title
      || 'All systems normal';

  const gardenLabel = data.garden.needsWater.length > 0
    ? `${pluralize(data.garden.needsWater.length, 'plant')} need water`
    : 'Garden calm';

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
        <div className="pi-metric wide">
          <span>Garden</span>
          <strong>{gardenLabel}</strong>
        </div>
      </div>
    </PanelShell>
  );
}

export default NowPanel;
