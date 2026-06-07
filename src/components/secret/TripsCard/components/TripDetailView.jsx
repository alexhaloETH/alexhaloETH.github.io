import { useMemo, useState } from 'react';
import TripMap from './TripMap';
import WaypointEditor from './WaypointEditor';
import { getTripDays, colorForDay } from '../tripDays';

const formatDistance = (meters) => {
  if (meters == null) return '—';
  const miles = meters / 1609.344;
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi`;
};

const formatDuration = (seconds) => {
  if (seconds == null) return '—';
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

function TripDetailView({
  trip,
  pois = [],
  canWrite,
  onClose,
  onWaypointSave,
  onTripEdit,
  onTripDelete,
  onPoiClick,
}) {
  const [selectedWaypointId, setSelectedWaypointId] = useState(null);

  const dayData = useMemo(() => getTripDays(trip), [trip]);
  const isMultiDay = dayData.dayCount > 1;

  const dayGroups = useMemo(() => {
    const groups = [];
    for (const w of dayData.dayWaypoints) {
      let group = groups[groups.length - 1];
      if (!group || group.day !== w.effectiveDay) {
        group = { day: w.effectiveDay, color: colorForDay(w.effectiveDay), waypoints: [] };
        groups.push(group);
      }
      group.waypoints.push(w);
    }
    return groups;
  }, [dayData]);

  const selected = useMemo(
    () => dayData.dayWaypoints.find((w) => w.id === selectedWaypointId) || null,
    [dayData, selectedWaypointId],
  );

  const handleWaypointSave = async (payload) => {
    if (!selected) return false;
    return onWaypointSave(trip.id, selected.id, payload);
  };

  const renderWaypointRow = (w) => (
    <li key={w.id} className={selectedWaypointId === w.id ? 'active' : ''}>
      <button
        type="button"
        className="trip-waypoint-row"
        onClick={() => setSelectedWaypointId(w.id)}
      >
        <span className="trip-waypoint-label">
          {w.isOvernight && (
            <span className="trip-camp-badge" title="Camp / overnight stop">⛺</span>
          )}
          {w.label || `Stop ${w.sequenceOrder + 1}`}
        </span>
        <span className="trip-waypoint-coord">
          {w.latitude.toFixed(4)}, {w.longitude.toFixed(4)}
        </span>
        {w.score != null && (
          <span className="trip-waypoint-score">{w.score}/10</span>
        )}
      </button>
    </li>
  );

  return (
    <div className="trip-detail">
      <div className="trip-detail-header">
        <div>
          <h3 className="trip-detail-title">{trip.name}</h3>
          <div className="trip-detail-meta">
            {isMultiDay && (
              <>
                <span>{dayData.dayCount} days</span>
                <span>·</span>
              </>
            )}
            <span>{trip.waypoints.length} stops</span>
            <span>·</span>
            <span>{formatDistance(trip.distanceM)}</span>
            <span>·</span>
            <span>{formatDuration(trip.durationS)}</span>
            {trip.score != null && (
              <>
                <span>·</span>
                <span>Score {trip.score}/10</span>
              </>
            )}
          </div>
        </div>
        <div className="trip-detail-actions">
          {canWrite && (
            <button type="button" className="ghost-button" onClick={() => onTripEdit(trip)}>
              Edit
            </button>
          )}
          <a
            className="ghost-button"
            href={trip.originalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </a>
          <button type="button" className="ghost-button" onClick={onClose}>
            Back to list
          </button>
        </div>
      </div>

      {trip.description && (
        <p className="trip-detail-description">{trip.description}</p>
      )}
      {trip.tags && trip.tags.length > 0 && (
        <div className="trip-detail-tags">
          {trip.tags.map((tag) => (
            <span key={tag} className="trip-tag">{tag}</span>
          ))}
        </div>
      )}

      <TripMap
        trip={trip}
        dayData={dayData}
        pois={pois}
        selectedWaypointId={selectedWaypointId}
        onWaypointClick={(w) => setSelectedWaypointId(w.id)}
        onPoiClick={onPoiClick}
        height={420}
      />

      {isMultiDay && (
        <div className="trip-days-summary">
          {dayData.summary.map((d) => (
            <div className="trip-day-chip" key={d.day}>
              <span className="trip-day-swatch" style={{ background: d.color }} />
              <span className="trip-day-chip-main">
                <span className="trip-day-chip-title">Day {d.day}</span>
                <span className="trip-day-chip-meta">
                  {[
                    formatDistance(d.distanceM),
                    formatDuration(d.durationS),
                    `${d.stops} stop${d.stops === 1 ? '' : 's'}`,
                  ].filter(Boolean).join(' · ')}
                </span>
                {d.campLabel && (
                  <span className="trip-day-chip-camp">⛺ {d.campLabel}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="trip-detail-body">
        <div className="trip-waypoints-list">
          <h4>Waypoints</h4>
          {isMultiDay ? (
            dayGroups.map((group) => (
              <div className="trip-day-group" key={`${group.day}-${group.waypoints[0].id}`}>
                <div className="trip-day-group-header">
                  <span className="trip-day-swatch" style={{ background: group.color }} />
                  Day {group.day}
                </div>
                <ol>
                  {group.waypoints.map(renderWaypointRow)}
                </ol>
              </div>
            ))
          ) : (
            <ol>
              {dayData.dayWaypoints.map(renderWaypointRow)}
            </ol>
          )}
        </div>

        <div className="trip-waypoint-detail">
          {selected ? (
            <WaypointEditor
              key={selected.id}
              waypoint={selected}
              canWrite={canWrite}
              computedDay={selected.computedDay}
              onSave={handleWaypointSave}
              onClose={() => setSelectedWaypointId(null)}
            />
          ) : (
            <div className="trip-waypoint-empty">
              Tick “Camp / overnight stop” on the stops where you stay the night — the trip
              splits into days automatically. Click a stop to add notes, a score, or a day.
            </div>
          )}
        </div>
      </div>

      {canWrite && (
        <div className="trip-detail-footer">
          <button
            type="button"
            className="danger-button"
            onClick={() => onTripDelete(trip)}
          >
            Delete trip
          </button>
        </div>
      )}
    </div>
  );
}

export default TripDetailView;
