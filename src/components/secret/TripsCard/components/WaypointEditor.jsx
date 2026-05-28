import { useState } from 'react';

const SCORE_OPTIONS = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function WaypointEditor({ waypoint, canWrite, onSave, onClose }) {
  const [label, setLabel] = useState(waypoint.label || '');
  const [notes, setNotes] = useState(waypoint.notes || '');
  const [score, setScore] = useState(waypoint.score ?? '');
  const [dayNumber, setDayNumber] = useState(waypoint.dayNumber ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canWrite) return;
    setIsSaving(true);
    const ok = await onSave({
      label: label.trim() || null,
      notes: notes.trim() || null,
      score: score === '' ? null : Number(score),
      dayNumber: dayNumber === '' ? null : Number(dayNumber),
    });
    setIsSaving(false);
    if (ok) onClose?.();
  };

  return (
    <form className="waypoint-editor" onSubmit={handleSubmit}>
      <div className="waypoint-editor-row">
        <label>
          Label
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`Stop ${waypoint.sequenceOrder + 1}`}
            disabled={!canWrite}
            maxLength={80}
          />
        </label>
        <label>
          Score
          <select
            value={score === null ? '' : score}
            onChange={(e) => setScore(e.target.value)}
            disabled={!canWrite}
          >
            {SCORE_OPTIONS.map((opt) => (
              <option key={opt ?? 'null'} value={opt ?? ''}>
                {opt ?? '—'}
              </option>
            ))}
          </select>
        </label>
        <label>
          Day
          <input
            type="number"
            min="1"
            max="60"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            disabled={!canWrite}
            placeholder="—"
          />
        </label>
      </div>
      <label className="waypoint-editor-notes-label">
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Memories from this stop…"
          rows={3}
          disabled={!canWrite}
        />
      </label>
      <div className="waypoint-editor-actions">
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
        {canWrite && (
          <button type="submit" className="primary-button" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        )}
      </div>
    </form>
  );
}

export default WaypointEditor;
