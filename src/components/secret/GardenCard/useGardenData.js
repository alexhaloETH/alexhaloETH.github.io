import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createPlant as createPlantApi,
  deletePlant as deletePlantApi,
  getAllPlants,
  updatePlant as updatePlantApi,
} from '../../../utils/plantsApi';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfToday = () => parseDate(getTodayDateString());

const isReadyToHarvest = (plant, today) => {
  if (!plant.isHarvestable) {
    return false;
  }

  const start = parseDate(plant.harvestStartOn);
  const end = parseDate(plant.harvestEndOn);

  if (plant.status === 'ready') {
    return true;
  }

  if (start && start <= today) {
    return !end || end >= today;
  }

  return false;
};

const startsHarvestSoon = (plant, today) => {
  if (!plant.isHarvestable) {
    return false;
  }

  const start = parseDate(plant.harvestStartOn);
  if (!start) {
    return false;
  }

  const diffDays = Math.ceil((start - today) / MILLISECONDS_PER_DAY);
  return diffDays >= 0 && diffDays <= 7;
};

const getSortScore = (plant, today) => {
  if (isReadyToHarvest(plant, today)) {
    return 0;
  }

  if (startsHarvestSoon(plant, today)) {
    return 1;
  }

  if (plant.status === 'growing') {
    return 2;
  }

  if (plant.status === 'seedling') {
    return 3;
  }

  if (plant.status === 'planned') {
    return 4;
  }

  return 5;
};

function useGardenData(showNotification, { canReadPlants = true, canWritePlants = true } = {}) {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPlants = useCallback(async () => {
    if (!canReadPlants) {
      setPlants([]);
      return;
    }

    const fetchedPlants = await getAllPlants();
    setPlants(fetchedPlants);
  }, [canReadPlants]);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        setIsLoading(true);
        await refreshPlants();
      } catch (error) {
        console.error('Failed to load plants:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to load garden tracker data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, [refreshPlants, showNotification]);

  const sortedPlants = useMemo(() => {
    const today = startOfToday();
    return [...plants].sort((left, right) => {
      const scoreDiff = getSortScore(left, today) - getSortScore(right, today);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      const leftUpdated = parseDate(left.updatedAt?.slice?.(0, 10) || left.plantedOn) || new Date(0);
      const rightUpdated = parseDate(right.updatedAt?.slice?.(0, 10) || right.plantedOn) || new Date(0);
      return rightUpdated - leftUpdated;
    });
  }, [plants]);

  const stats = useMemo(() => {
    const today = startOfToday();
    return {
      total: plants.length,
      readyToHarvest: plants.filter((plant) => isReadyToHarvest(plant, today)).length,
      harvestSoon: plants.filter((plant) => startsHarvestSoon(plant, today)).length,
      harvestTracked: plants.filter((plant) => plant.isHarvestable).length,
    };
  }, [plants]);

  const addPlant = async (plant) => {
    if (!canWritePlants) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to add plants',
        type: 'error',
      });
      return false;
    }

    try {
      await createPlantApi(plant);
      await refreshPlants();
      setShowAddPlantModal(false);
      showNotification({
        title: 'Saved',
        message: `${plant.name} added to the garden tracker`,
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to add plant:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add plant',
        type: 'error',
      });
      return false;
    }
  };

  const updatePlant = async (plant) => {
    if (!canWritePlants) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to update plants',
        type: 'error',
      });
      return false;
    }

    try {
      await updatePlantApi(plant.id, plant);
      await refreshPlants();
      setEditingPlant(null);
      showNotification({
        title: 'Updated',
        message: `${plant.name} was updated`,
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to update plant:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to update plant',
        type: 'error',
      });
      return false;
    }
  };

  const deletePlant = async (id) => {
    if (!canWritePlants) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to delete plants',
        type: 'error',
      });
      return false;
    }

    const plant = plants.find((item) => item.id === id);

    try {
      await deletePlantApi(id);
      await refreshPlants();
      setEditingPlant(null);
      showNotification({
        title: 'Deleted',
        message: plant ? `${plant.name} removed from the tracker` : 'Plant removed',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete plant:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to delete plant',
        type: 'error',
      });
      return false;
    }
  };

  return {
    plants: sortedPlants,
    stats,
    isLoading,
    editingPlant,
    setEditingPlant,
    showAddPlantModal,
    setShowAddPlantModal,
    addPlant,
    updatePlant,
    deletePlant,
  };
}

export default useGardenData;
