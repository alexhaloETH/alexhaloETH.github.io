import { AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { useNotification } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import PlantModal from './components/PlantModal';
import useGardenData from './useGardenData';
import './GardenCard.css';

const STATUS_LABELS = {
  planned: 'Planned',
  seedling: 'Seedling',
  growing: 'Growing',
  ready: 'Ready',
  finished: 'Finished',
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const formatDateObject = (date) => {
  if (!date) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (value, days) => {
  const date = parseDate(value);
  if (!date) {
    return null;
  }

  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getNextWaterDate = (plant) => {
  const anchor = plant.lastWateredOn || plant.plantedOn;
  if (!anchor || !plant.wateringIntervalDays) {
    return null;
  }

  return addDays(anchor, plant.wateringIntervalDays);
};

const getPlantSignals = (plant) => {
  const today = parseDate(getTodayDateString());
  const nextWaterDate = getNextWaterDate(plant);
  const harvestStartDate = parseDate(plant.harvestStartOn);
  const harvestEndDate = parseDate(plant.harvestEndOn);

  const needsWater = Boolean(nextWaterDate && nextWaterDate <= today);
  const daysUntilWater = nextWaterDate
    ? Math.ceil((nextWaterDate - today) / MILLISECONDS_PER_DAY)
    : null;
  const readyToHarvest = plant.isHarvestable
    && (
      plant.status === 'ready'
      || (harvestStartDate && harvestStartDate <= today && (!harvestEndDate || harvestEndDate >= today))
    );
  const harvestSoon = Boolean(
    plant.isHarvestable
      && harvestStartDate
      && harvestStartDate > today
      && Math.ceil((harvestStartDate - today) / MILLISECONDS_PER_DAY) <= 7,
  );

  let waterLabel = 'Set watering date';
  if (nextWaterDate) {
    if (daysUntilWater === null) {
      waterLabel = formatDate(plant.lastWateredOn);
    } else if (daysUntilWater <= 0) {
      waterLabel = daysUntilWater === 0 ? 'Today' : `${Math.abs(daysUntilWater)}d overdue`;
    } else if (daysUntilWater === 1) {
      waterLabel = 'Tomorrow';
    } else {
      waterLabel = formatDateObject(nextWaterDate);
    }
  }

  let harvestWindowLabel = 'Not tracked';
  if (plant.isHarvestable) {
    if (readyToHarvest) {
      harvestWindowLabel = 'Ready now';
    } else if (harvestSoon) {
      harvestWindowLabel = `Starts ${formatDate(plant.harvestStartOn)}`;
    } else if (plant.harvestStartOn) {
      harvestWindowLabel = formatDate(plant.harvestStartOn);
    } else {
      harvestWindowLabel = 'Set harvest date';
    }
  }

  let insight = 'Steady growth';
  if (readyToHarvest) {
    insight = 'Harvest window is open';
  } else if (needsWater) {
    insight = 'Watering is due';
  } else if (harvestSoon) {
    insight = 'Harvest window opens soon';
  } else if (!plant.lastWateredOn) {
    insight = 'Set the first watering checkpoint';
  }

  return {
    needsWater,
    readyToHarvest,
    harvestSoon,
    waterLabel,
    harvestWindowLabel,
    insight,
  };
};

function GardenCard() {
  const { showNotification } = useNotification();
  const { canWrite } = useAuth();
  const canWritePlants = canWrite('plants');
  const {
    plants,
    stats,
    isLoading,
    editingPlant,
    setEditingPlant,
    showAddPlantModal,
    setShowAddPlantModal,
    addPlant,
    updatePlant,
    deletePlant,
    markPlantWatered,
  } = useGardenData(showNotification, {
    canReadPlants: true,
    canWritePlants,
  });

  return (
    <BaseCard className="card secret-card garden-card">
      <div className="card-header garden-card-header">
        <div className="garden-title-block">
          <div className="card-icon garden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 20c4 0 7-3 7-7V4C9 4 5 8 5 13c0 2.1.7 3.9 2 5.4" />
              <path d="M14 20c3.3 0 5-2 5-5v-3c-2.4 0-4.5 1.1-5.8 3" />
              <path d="M12 20v-5" />
            </svg>
          </div>
          <div>
            <h3>Garden Tracker</h3>
            <p className="garden-subtitle">
              {stats.needsWater > 0
                ? `${stats.needsWater} plant${stats.needsWater === 1 ? '' : 's'} need water`
                : 'Watering schedule under control'}
            </p>
          </div>
        </div>

        {canWritePlants && (
          <button
            type="button"
            className="garden-add-btn"
            onClick={() => setShowAddPlantModal(true)}
          >
            Add plant
          </button>
        )}
      </div>

      <div className="garden-stats">
        <div className="garden-stat">
          <span className="garden-stat-label">Water today</span>
          <strong>{stats.needsWater}</strong>
        </div>
        <div className="garden-stat">
          <span className="garden-stat-label">Harvest now</span>
          <strong>{stats.readyToHarvest}</strong>
        </div>
        <div className="garden-stat">
          <span className="garden-stat-label">Harvest soon</span>
          <strong>{stats.harvestSoon}</strong>
        </div>
        <div className="garden-stat">
          <span className="garden-stat-label">Tracked plants</span>
          <strong>{stats.total}</strong>
        </div>
      </div>

      <div className="card-content garden-content">
        {isLoading && (
          <div className="garden-empty-state">
            <p>Loading garden tracker...</p>
          </div>
        )}

        {!isLoading && plants.length === 0 && (
          <div className="garden-empty-state">
            <h4>No plants tracked yet</h4>
            <p>
              Add tomatoes, chives, herbs, or anything else you want to keep watered and on
              harvest schedule.
            </p>
            {canWritePlants && (
              <button
                type="button"
                className="garden-primary-btn"
                onClick={() => setShowAddPlantModal(true)}
              >
                Add the first plant
              </button>
            )}
          </div>
        )}

        {!isLoading && plants.length > 0 && (
          <div className="garden-list">
            {plants.map((plant) => {
              const signals = getPlantSignals(plant);
              const wateredToday = plant.lastWateredOn === getTodayDateString();

              return (
                <article
                  key={plant.id}
                  className={[
                    'garden-item',
                    signals.needsWater ? 'needs-water' : '',
                    signals.readyToHarvest ? 'ready-to-harvest' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="garden-item-top">
                    <div>
                      <h4>{plant.name}</h4>
                      <p className="garden-item-meta">
                        {[plant.variety, plant.location].filter(Boolean).join(' • ') || 'Garden entry'}
                      </p>
                    </div>

                    <div className="garden-badges">
                      {plant.isHarvestable ? (
                        <span className={`garden-pill ${signals.readyToHarvest ? 'warm' : ''}`}>
                          {signals.harvestWindowLabel}
                        </span>
                      ) : (
                        <span className="garden-pill muted">Decorative</span>
                      )}
                      <span className={`garden-status ${plant.status}`}>
                        {STATUS_LABELS[plant.status] || plant.status}
                      </span>
                    </div>
                  </div>

                  <div className="garden-schedule-grid">
                    <div className="garden-schedule-card">
                      <span>Next water</span>
                      <strong>{signals.waterLabel}</strong>
                    </div>
                    <div className="garden-schedule-card">
                      <span>Harvest opens</span>
                      <strong>{plant.isHarvestable ? formatDate(plant.harvestStartOn) : 'Not tracked'}</strong>
                    </div>
                    <div className="garden-schedule-card">
                      <span>Harvest closes</span>
                      <strong>{plant.isHarvestable ? formatDate(plant.harvestEndOn) : 'Not tracked'}</strong>
                    </div>
                    <div className="garden-schedule-card">
                      <span>Planted</span>
                      <strong>{formatDate(plant.plantedOn)}</strong>
                    </div>
                  </div>

                  {plant.notes && <p className="garden-notes">{plant.notes}</p>}

                  <div className="garden-item-footer">
                    <span className="garden-insight">{signals.insight}</span>

                    {canWritePlants && (
                      <div className="garden-actions">
                        <button
                          type="button"
                          className="garden-secondary-btn"
                          onClick={() => markPlantWatered(plant)}
                          disabled={wateredToday}
                        >
                          {wateredToday ? 'Watered today' : 'Mark watered'}
                        </button>
                        <button
                          type="button"
                          className="garden-secondary-btn"
                          onClick={() => setEditingPlant(plant)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddPlantModal && (
          <PlantModal
            onClose={() => setShowAddPlantModal(false)}
            onSubmit={addPlant}
          />
        )}
        {editingPlant && (
          <PlantModal
            plant={editingPlant}
            onClose={() => setEditingPlant(null)}
            onSubmit={updatePlant}
            onDelete={deletePlant}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default GardenCard;
