import PanelShell from './PanelShell';
import { formatShortDate } from '../piDisplayUtils';

function getHarvestLabel(plant) {
  if (!plant || !plant.harvestStartOn) {
    return 'No harvest date';
  }

  if (plant.readyToHarvest) {
    return 'Ready now';
  }

  if (plant.daysUntilHarvest === 0) {
    return 'Starts today';
  }

  if (plant.daysUntilHarvest === 1) {
    return 'Starts tomorrow';
  }

  if (typeof plant.daysUntilHarvest === 'number' && plant.daysUntilHarvest > 1) {
    return `Starts in ${plant.daysUntilHarvest}d`;
  }

  return formatShortDate(plant.harvestStartOn);
}

function GardenPanel({ data }) {
  const { garden } = data;
  const readyPlants = garden.readyToHarvest.slice(0, 3);
  const soonPlants = garden.harvestSoon.slice(0, 3);
  const title = readyPlants.length ? 'Harvest Ready' : 'Garden Watch';
  const tone = readyPlants.length ? 'warning' : 'green';

  return (
    <PanelShell eyebrow="Garden" title={title} tone={tone}>
      {!garden.ok && (
        <div className="pi-empty">
          <strong>Garden unavailable</strong>
          <span>{garden.error || 'No plant data loaded'}</span>
        </div>
      )}

      {garden.ok && (
        <>
          <div className="pi-list">
            {readyPlants.length > 0 ? readyPlants.map((plant) => (
              <div key={plant.id} className="pi-list-item urgent">
                <strong>{plant.name}</strong>
                <span>Ready now</span>
              </div>
            )) : soonPlants.length > 0 ? soonPlants.map((plant) => (
              <div key={plant.id} className="pi-list-item">
                <strong>{plant.name}</strong>
                <span>{getHarvestLabel(plant)}</span>
              </div>
            )) : (
              <div className="pi-list-item">
                <strong>{garden.total ? `${garden.total} plants tracked` : 'No plants tracked'}</strong>
                <span>
                  {garden.nextHarvestPlant
                    ? `Next harvest ${formatShortDate(garden.nextHarvestPlant.harvestStartOn)}`
                    : 'No harvest windows set'}
                </span>
              </div>
            )}
          </div>

          <div className="pi-divider" />

          <div className="pi-mini-section">
            <span>Tracking</span>
            <strong>
              {garden.harvestTracked > 0
                ? `${garden.harvestTracked} harvest plants`
                : 'Decorative only'}
            </strong>
          </div>
        </>
      )}
    </PanelShell>
  );
}

export default GardenPanel;
