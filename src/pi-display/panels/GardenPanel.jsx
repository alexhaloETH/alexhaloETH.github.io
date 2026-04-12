import PanelShell from './PanelShell';
import { formatShortDate } from '../piDisplayUtils';

function getWaterLabel(plant) {
  if (!plant) {
    return 'No watering data';
  }

  if (plant.daysUntilWater < 0) {
    return `${Math.abs(plant.daysUntilWater)}d overdue`;
  }

  if (plant.daysUntilWater === 0) {
    return 'Due today';
  }

  if (plant.daysUntilWater === 1) {
    return 'Tomorrow';
  }

  return `In ${plant.daysUntilWater}d`;
}

function GardenPanel({ data }) {
  const { garden } = data;
  const waterPlants = garden.needsWater.slice(0, 3);
  const harvestPlants = garden.readyToHarvest.slice(0, 2);

  return (
    <PanelShell eyebrow="Garden" title={garden.needsWater.length ? 'Water Today' : 'All Watered'} tone={garden.needsWater.length ? 'warning' : 'green'}>
      {!garden.ok && (
        <div className="pi-empty">
          <strong>Garden unavailable</strong>
          <span>{garden.error || 'No plant data loaded'}</span>
        </div>
      )}

      {garden.ok && (
        <>
          <div className="pi-list">
            {waterPlants.length > 0 ? waterPlants.map((plant) => (
              <div key={plant.id} className="pi-list-item urgent">
                <strong>{plant.name}</strong>
                <span>{getWaterLabel(plant)}</span>
              </div>
            )) : (
              <div className="pi-list-item">
                <strong>{garden.nextWaterPlant?.name || 'No plants due'}</strong>
                <span>{getWaterLabel(garden.nextWaterPlant)}</span>
              </div>
            )}
          </div>

          <div className="pi-divider" />

          <div className="pi-mini-section">
            <span>Harvest</span>
            {harvestPlants.length > 0 ? (
              <strong>{harvestPlants.map((plant) => plant.name).join(', ')}</strong>
            ) : (
              <strong>
                {garden.nextHarvestPlant
                  ? `${garden.nextHarvestPlant.name} · ${formatShortDate(garden.nextHarvestPlant.harvestStartOn)}`
                  : 'No harvest window'}
              </strong>
            )}
          </div>
        </>
      )}
    </PanelShell>
  );
}

export default GardenPanel;
