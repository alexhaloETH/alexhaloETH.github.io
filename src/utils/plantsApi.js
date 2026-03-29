import { apiRequest, withErrorContext } from './apiClient';

const normalizeString = (value) => (typeof value === 'string' ? value : '');

const transformPlant = (plant) => ({
  id: plant.id,
  name: normalizeString(plant.name),
  variety: normalizeString(plant.variety),
  location: normalizeString(plant.location),
  status: normalizeString(plant.status) || 'growing',
  plantedOn: normalizeString(plant.planting_date),
  harvestStartOn: normalizeString(plant.harvest_start_date),
  harvestEndOn: normalizeString(plant.harvest_end_date),
  wateringIntervalDays: Number(plant.watering_interval_days) || 3,
  lastWateredOn: normalizeString(plant.last_watered_date),
  isHarvestable: Boolean(plant.is_harvestable),
  notes: normalizeString(plant.notes),
  createdAt: normalizeString(plant.created_at),
  updatedAt: normalizeString(plant.updated_at),
});

const toOptionalString = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const transformToBackend = (plant) => ({
  name: plant.name.trim(),
  variety: toOptionalString(plant.variety),
  location: toOptionalString(plant.location),
  status: plant.status || 'growing',
  planting_date: toOptionalString(plant.plantedOn),
  harvest_start_date: plant.isHarvestable ? toOptionalString(plant.harvestStartOn) : null,
  harvest_end_date: plant.isHarvestable ? toOptionalString(plant.harvestEndOn) : null,
  watering_interval_days: Number(plant.wateringIntervalDays) || 3,
  last_watered_date: toOptionalString(plant.lastWateredOn),
  is_harvestable: Boolean(plant.isHarvestable),
  notes: toOptionalString(plant.notes),
});

export const getAllPlants = async () => withErrorContext('Error fetching plants', async () => {
  const data = await apiRequest('/plants');
  return data.map(transformPlant);
});

export const createPlant = async (plant) => withErrorContext('Error creating plant', () => (
  apiRequest('/plants', {
    method: 'POST',
    body: transformToBackend(plant),
  })
));

export const updatePlant = async (id, plant) => withErrorContext(`Error updating plant ${id}`, () => (
  apiRequest(`/plants/${id}`, {
    method: 'PUT',
    body: transformToBackend(plant),
  })
));

export const deletePlant = async (id) => withErrorContext(`Error deleting plant ${id}`, () => (
  apiRequest(`/plants/${id}`, {
    method: 'DELETE',
  })
));
