import { useState } from 'react';
import { motion } from 'framer-motion';
import { RECURRENCE_OPTIONS, MISSION_TYPE_OPTIONS } from '../TasksCard.constants';

function EditMissionModal({ mission, onClose, onSave, onDelete }) {
  const [name, setName] = useState(mission.name);
  const [description, setDescription] = useState(mission.description || '');
  const [recurrenceType, setRecurrenceType] = useState(mission.recurrenceType);
  const [missionType, setMissionType] = useState(mission.missionType || 'streak');
  const [unit, setUnit] = useState(mission.unit || 'count');
  const [targetAmount, setTargetAmount] = useState(
    mission.targetAmount !== null && mission.targetAmount !== undefined
      ? String(mission.targetAmount)
      : ''
  );
  const entriesLabel = mission.targetAmount ? 'Hits' : 'Entries';

  const handleSave = () => {
    if (!name.trim()) return;
    const trimmedUnit = unit.trim();
    const parsedTarget = targetAmount.toString().trim()
      ? Number(targetAmount)
      : null;
    onSave({
      ...mission,
      name: name.trim(),
      description: description.trim(),
      recurrenceType,
      missionType,
      unit: missionType === 'amount' ? (trimmedUnit || 'count') : '',
      targetAmount: missionType === 'amount' && !Number.isNaN(parsedTarget)
        ? parsedTarget
        : null,
    });
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content edit-mission-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>🎯 Edit Mission</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Mission Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter mission name..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this mission..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Mission Type</label>
            <div className="recurrence-selector">
              {MISSION_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`recurrence-btn ${missionType === option.value ? 'active' : ''}`}
                  onClick={() => setMissionType(option.value)}
                >
                  <span className="recurrence-icon">{option.icon}</span>
                  <span className="recurrence-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {missionType === 'amount' && (
            <div className="mission-amount-settings">
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., reps, pages, minutes"
                />
              </div>
              <div className="form-group">
                <label>Target (optional)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g., 30"
                  min="0"
                />
              </div>
              <div className="mission-info amount-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                  Log how much you did each period. Add a target to track streaks.
                </span>
              </div>
            </div>
          )}

          {missionType === 'checkbox' && (
            <div className="mission-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>
                Simple one-time task. Auto-deletes the day after completion.
              </span>
            </div>
          )}

          {missionType !== 'checkbox' && (
            <>
              <div className="form-group">
                <label>Recurrence</label>
                <div className="recurrence-selector">
                  {RECURRENCE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`recurrence-btn ${recurrenceType === option.value ? 'active' : ''}`}
                      onClick={() => setRecurrenceType(option.value)}
                    >
                      <span className="recurrence-icon">{option.icon}</span>
                      <span className="recurrence-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mission-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>
                  {recurrenceType === 'daily' && 'Resets every day at midnight'}
                  {recurrenceType === 'weekly' && 'Resets every Monday'}
                  {recurrenceType === 'biweekly' && 'Resets every 2 weeks'}
                  {recurrenceType === 'monthly' && 'Resets on the 1st of each month'}
                </span>
              </div>
            </>
          )}

          {missionType === 'amount' ? (
            <>
              <div className="mission-stats-panel amount-stats-panel">
                <div className="mission-stat">
                  <span>Current</span>
                  <strong>{mission.currentAmount ?? 0} {mission.unit || 'count'}</strong>
                </div>
                <div className="mission-stat">
                  <span>Best</span>
                  <strong>{mission.bestAmount ?? 0} {mission.unit || 'count'}</strong>
                </div>
                <div className="mission-stat">
                  <span>Avg</span>
                  <strong>{mission.averageAmount ?? 0} {mission.unit || 'count'}</strong>
                </div>
                <div className="mission-stat">
                  <span>{entriesLabel}</span>
                  <strong>{mission.totalCompletions || 0}</strong>
                </div>
              </div>
              {mission.lastCompletedAt && (
                <div className="mission-stats">
                  <span>Last logged: {new Date(mission.lastCompletedAt).toLocaleDateString()}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mission-stats-panel">
                <div className="mission-stat">
                  <span>Streak</span>
                  <strong>{mission.currentStreak || 0}</strong>
                </div>
                <div className="mission-stat">
                  <span>Best</span>
                  <strong>{mission.bestStreak || 0}</strong>
                </div>
                <div className="mission-stat">
                  <span>Total</span>
                  <strong>{mission.totalCompletions || 0}</strong>
                </div>
              </div>
              {mission.completed && mission.lastCompletedAt && (
                <div className="mission-stats">
                  <span>Last completed: {new Date(mission.lastCompletedAt).toLocaleDateString()}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-delete" onClick={() => { onDelete(mission.id); onClose(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
            </svg>
            Delete
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={!name.trim()}>
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EditMissionModal;
