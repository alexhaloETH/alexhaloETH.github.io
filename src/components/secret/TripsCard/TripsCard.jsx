import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import TripMap from './components/TripMap';
import TripDetailView from './components/TripDetailView';
import TagFilterBar from './components/TagFilterBar';
import TripModal from './TripModal';
import useTripsData from './useTripsData';
import './TripsCard.css';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(date);
};

const formatDistance = (meters) => {
  if (meters == null) return null;
  const miles = meters / 1609.344;
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi`;
};

function TripsCard() {
  const { canWrite } = useAuth();
  const { showNotification } = useNotification();
  const canWriteTrips = canWrite('trips');
  const {
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
  } = useTripsData(showNotification, { canReadTrips: true, canWriteTrips });

  const [modalState, setModalState] = useState({ open: false, mode: 'create', trip: null });
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [trips]);

  const filteredTrips = useMemo(() => {
    if (selectedTags.length === 0) return trips;
    return trips.filter((t) => (t.tags || []).some((tag) => selectedTags.includes(tag)));
  }, [trips, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    ));
  };

  const handleAddSubmit = async (payload) => {
    const detail = await addTrip(payload);
    if (detail) {
      await openTrip(detail.id);
      return true;
    }
    return false;
  };

  const handleEditSubmit = async (payload) => {
    if (!modalState.trip) return false;
    return saveTrip(modalState.trip.id, payload);
  };

  const handleDelete = async (trip) => {
    if (!canWriteTrips) return;
    const confirmed = window.confirm(`Delete "${trip.name}"? This also removes any attached photos.`);
    if (!confirmed) return;
    await removeTrip(trip.id);
  };

  return (
    <BaseCard className="card secret-card trips-card">
      <div className="card-header trips-card-header">
        <div className="trips-title-block">
          <div className="card-icon trips">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6l6 -3 6 3 6 -3v15l-6 3 -6 -3 -6 3z" />
              <path d="M9 3v15" />
              <path d="M15 6v15" />
            </svg>
          </div>
          <div>
            <h3>Trips Journal</h3>
            <p className="trips-subtitle">
              {trips.length === 0
                ? 'No trips yet — paste a Google Maps route to start.'
                : selectedTags.length > 0
                  ? `${filteredTrips.length} of ${trips.length} routes shown`
                  : `${trips.length} route${trips.length === 1 ? '' : 's'} on the map`}
            </p>
          </div>
        </div>
        <div className="trips-card-actions">
          {selectedTripDetail && (
            <button type="button" className="ghost-button" onClick={closeTrip}>
              All trips
            </button>
          )}
          {canWriteTrips && !selectedTripDetail && (
            <button
              type="button"
              className="primary-button"
              onClick={() => setModalState({ open: true, mode: 'create', trip: null })}
            >
              Add trip
            </button>
          )}
        </div>
      </div>

      <div className="trips-card-body">
        {isLoading && <div className="trips-loading">Loading trips…</div>}

        {!isLoading && !selectedTripDetail && (
          <div className="trips-overview">
            <TagFilterBar
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => setSelectedTags([])}
            />
            <TripMap trips={filteredTrips} height={360} />
            <ul className="trips-list">
              {trips.length === 0 && (
                <li className="trips-list-empty">
                  Add your first route to see it drawn on the map.
                </li>
              )}
              {trips.length > 0 && filteredTrips.length === 0 && (
                <li className="trips-list-empty">
                  No trips match the selected tags.
                </li>
              )}
              {filteredTrips.map((trip) => (
                <li key={trip.id}>
                  <button
                    type="button"
                    className="trips-list-row"
                    onClick={() => openTrip(trip.id)}
                  >
                    <div className="trips-list-main">
                      <span className="trips-list-name">{trip.name}</span>
                      <span className="trips-list-meta">
                        {[
                          formatDistance(trip.distanceM),
                          formatDate(trip.startDate),
                          trip.score != null ? `Score ${trip.score}/10` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </span>
                    </div>
                    {trip.tags && trip.tags.length > 0 && (
                      <div className="trips-list-tags">
                        {trip.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="trip-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isLoading && selectedTripDetail && (
          <>
            {isDetailLoading && <div className="trips-loading subtle">Refreshing…</div>}
            <TripDetailView
              trip={selectedTripDetail}
              canWrite={canWriteTrips}
              onClose={closeTrip}
              onWaypointSave={saveWaypoint}
              onTripEdit={(trip) => setModalState({ open: true, mode: 'edit', trip })}
              onTripDelete={handleDelete}
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {modalState.open && (
          <TripModal
            mode={modalState.mode}
            trip={modalState.trip}
            onSubmit={modalState.mode === 'edit' ? handleEditSubmit : handleAddSubmit}
            onClose={() => setModalState({ open: false, mode: 'create', trip: null })}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default TripsCard;
