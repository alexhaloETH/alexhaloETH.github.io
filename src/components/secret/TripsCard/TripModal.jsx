import { useState } from 'react';

const SCORE_OPTIONS = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const emptyState = {
  url: '',
  name: '',
  description: '',
  tags: '',
  startDate: '',
  endDate: '',
  score: '',
};

const buildInitialForm = (mode, trip) => {
  if (mode === 'edit' && trip) {
    return {
      url: trip.originalUrl || '',
      name: trip.name || '',
      description: trip.description || '',
      tags: (trip.tags || []).join(', '),
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      score: trip.score ?? '',
    };
  }
  return emptyState;
};

function TripModal({ mode = 'create', trip = null, onSubmit, onClose }) {
  const isEdit = mode === 'edit' && trip;
  const [form, setForm] = useState(() => buildInitialForm(mode, trip));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = isEdit
      ? {
          name: form.name.trim() || trip.name,
          description: form.description.trim(),
          tags,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          score: form.score === '' ? null : Number(form.score),
        }
      : {
          url: form.url.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          tags,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        };

    if (!isEdit && !payload.url) return;

    setIsSubmitting(true);
    const ok = await onSubmit(payload);
    setIsSubmitting(false);
    if (ok) onClose?.();
  };

  return (
    <div className="trip-modal-backdrop" onClick={onClose}>
      <div className="trip-modal" onClick={(e) => e.stopPropagation()}>
        <header className="trip-modal-header">
          <h3>{isEdit ? 'Edit trip' : 'Add a new trip'}</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Cancel
          </button>
        </header>
        <form className="trip-modal-form" onSubmit={handleSubmit}>
          {!isEdit && (
            <label>
              Google Maps URL
              <input
                type="url"
                value={form.url}
                onChange={update('url')}
                placeholder="https://www.google.com/maps/dir/… or https://maps.app.goo.gl/…"
                required
                autoFocus
              />
              <span className="trip-modal-hint">
                Paste either the long share URL or the short app link. The route is parsed and stored on save.
              </span>
            </label>
          )}
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Wales coast run"
              maxLength={120}
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={update('description')}
              placeholder="What was this trip about?"
            />
          </label>
          <div className="trip-modal-row">
            <label>
              Start
              <input type="date" value={form.startDate} onChange={update('startDate')} />
            </label>
            <label>
              End
              <input type="date" value={form.endDate} onChange={update('endDate')} />
            </label>
            {isEdit && (
              <label>
                Score
                <select value={form.score === null ? '' : form.score} onChange={update('score')}>
                  {SCORE_OPTIONS.map((opt) => (
                    <option key={opt ?? 'null'} value={opt ?? ''}>
                      {opt ?? '—'}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <label>
            Tags
            <input
              type="text"
              value={form.tags}
              onChange={update('tags')}
              placeholder="coast, wales, weekend"
            />
            <span className="trip-modal-hint">Comma-separated.</span>
          </label>
          <div className="trip-modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripModal;
