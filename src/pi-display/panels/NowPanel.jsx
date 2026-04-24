import PanelShell from './PanelShell';
import { pluralize } from '../piDisplayUtils';

function NowPanel({ data }) {
  const nextAction = data.garden.readyToHarvest[0]
    ? `Harvest ${data.garden.readyToHarvest[0].name}`
    : data.daily.highPriorityTask?.text
      || data.library.currentBook?.title
      || (data.garden.nextHarvestPlant ? `Check ${data.garden.nextHarvestPlant.name}` : null)
      || 'All systems normal';

  const gardenLabel = data.garden.readyToHarvest.length > 0
    ? `${pluralize(data.garden.readyToHarvest.length, 'plant')} ready to harvest`
    : data.garden.harvestSoon.length > 0
      ? `${pluralize(data.garden.harvestSoon.length, 'plant')} nearing harvest`
      : data.garden.total > 0
        ? `${pluralize(data.garden.total, 'plant')} tracked`
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
