import { useCallback, useEffect, useState } from 'react';
import {
  createTrip as createTripApi,
  deleteTrip as deleteTripApi,
  getAllTrips,
  getTrip as getTripApi,
  updateTrip as updateTripApi,
  updateWaypoint as updateWaypointApi,
} from '../../../utils/tripsApi';

function useTripsData(showNotification, { canReadTrips = true, canWriteTrips = true } = {}) {
  const [trips, setTrips] = useState([]);
  const [selectedTripDetail, setSelectedTripDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const refreshTrips = useCallback(async () => {
    if (!canReadTrips) {
      setTrips([]);
      return;
    }
    const fetched = await getAllTrips();
    setTrips(fetched);
  }, [canReadTrips]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        await refreshTrips();
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to load trips:', error);
        showNotification?.({
          title: 'Error',
          message: 'Failed to load trips',
          type: 'error',
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [refreshTrips, showNotification]);

  const openTrip = useCallback(async (tripId) => {
    if (!canReadTrips) return;
    try {
      setIsDetailLoading(true);
      const detail = await getTripApi(tripId);
      setSelectedTripDetail(detail);
    } catch (error) {
      console.error('Failed to load trip detail:', error);
      showNotification?.({
        title: 'Error',
        message: 'Failed to load trip details',
        type: 'error',
      });
    } finally {
      setIsDetailLoading(false);
    }
  }, [canReadTrips, showNotification]);

  const closeTrip = useCallback(() => {
    setSelectedTripDetail(null);
  }, []);

  const addTrip = useCallback(async (payload) => {
    if (!canWriteTrips) {
      showNotification?.({
        title: 'Access denied',
        message: 'You do not have permission to add trips',
        type: 'error',
      });
      return null;
    }
    try {
      const detail = await createTripApi(payload);
      await refreshTrips();
      showNotification?.({
        title: 'Saved',
        message: `${detail.name} added to the journal`,
        type: 'success',
      });
      return detail;
    } catch (error) {
      console.error('Failed to add trip:', error);
      showNotification?.({
        title: 'Error',
        message: error.message || 'Failed to add trip',
        type: 'error',
      });
      return null;
    }
  }, [canWriteTrips, refreshTrips, showNotification]);

  const saveTrip = useCallback(async (id, payload) => {
    if (!canWriteTrips) return false;
    try {
      await updateTripApi(id, payload);
      await refreshTrips();
      if (selectedTripDetail?.id === id) {
        const detail = await getTripApi(id);
        setSelectedTripDetail(detail);
      }
      showNotification?.({
        title: 'Updated',
        message: 'Trip updated',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to update trip:', error);
      showNotification?.({
        title: 'Error',
        message: 'Failed to update trip',
        type: 'error',
      });
      return false;
    }
  }, [canWriteTrips, refreshTrips, selectedTripDetail, showNotification]);

  const removeTrip = useCallback(async (id) => {
    if (!canWriteTrips) return false;
    try {
      await deleteTripApi(id);
      if (selectedTripDetail?.id === id) {
        setSelectedTripDetail(null);
      }
      await refreshTrips();
      showNotification?.({
        title: 'Deleted',
        message: 'Trip removed',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete trip:', error);
      showNotification?.({
        title: 'Error',
        message: 'Failed to delete trip',
        type: 'error',
      });
      return false;
    }
  }, [canWriteTrips, refreshTrips, selectedTripDetail, showNotification]);

  const saveWaypoint = useCallback(async (tripId, waypointId, payload) => {
    if (!canWriteTrips) return false;
    try {
      await updateWaypointApi(tripId, waypointId, payload);
      const detail = await getTripApi(tripId);
      setSelectedTripDetail(detail);
      return true;
    } catch (error) {
      console.error('Failed to update waypoint:', error);
      showNotification?.({
        title: 'Error',
        message: 'Failed to update waypoint',
        type: 'error',
      });
      return false;
    }
  }, [canWriteTrips, showNotification]);

  return {
    trips,
    selectedTripDetail,
    isLoading,
    isDetailLoading,
    openTrip,
    closeTrip,
    addTrip,
    saveTrip,
    removeTrip,
    saveWaypoint,
  };
}

export default useTripsData;
