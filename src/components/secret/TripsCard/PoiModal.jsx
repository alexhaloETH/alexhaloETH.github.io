import { useState } from 'react';
import { geocode } from './geocode';

function PoiModal({ mode = 'create', poi = null, onSubmit, onClose }) {
  const isEdit = mode === 'edit' && poi;
  const [name, setName] = useState(poi?.name || '');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState(poi?.notes || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Give the place a name.');
      return;
    }

    setBusy(true);
    try {
      let coords;
      if (location.trim()) {
        coords = await geocode(location.trim());
      } else if (isEdit) {
        coords = { latitude: poi.latitude, longitude: poi.longitude, address: poi.address };
      } else {
        setBusy(false);
        setError('Enter an address, postcode, coordinates, or a Google Maps link.');
        return;
      }

      const ok = await onSubmit({
        name: trimmedName,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: coords.address || (isEdit ? poi.address : location.trim()),
        notes: notes.trim(),
      });
      setBusy(false);
      if (ok) onClose?.();
    } catch (err) {
      setBusy(false);
      setError(err.message || 'Could not find that location.');
    }
  };

  return (
    <div className="trip-modal-backdrop" onClick={onClose}>
      <div className="trip-modal" onClick={(e) => e.stopPropagation()}>
        <header className="trip-modal-header">
          <h3>{isEdit ? 'Edit place' : 'Add a place'}</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Cancel
          </button>
        </header>
        <form className="trip-modal-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Home"
              maxLength={80}
              autoFocus
            />
          </label>
          <label>
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isEdit ? 'Leave blank to keep current location' : '10 Cae Twmping Road, NP18 2EH'}
            />
            <span className="trip-modal-hint">
              Address, postcode, “lat, lng”, or a Google Maps link.
            </span>
          </label>
          <label>
            Notes
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </label>
          {error && <p className="trip-modal-error">{error}</p>}
          <div className="trip-modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={busy}>
              {busy ? 'Locating…' : isEdit ? 'Save place' : 'Add place'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PoiModal;
