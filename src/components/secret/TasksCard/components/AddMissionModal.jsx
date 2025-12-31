import { useState } from 'react';
import { motion } from 'framer-motion';

const recurrenceOptions = [
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'biweekly', label: 'Every 2 Weeks', icon: '🗓️' },
  { value: 'monthly', label: 'Monthly', icon: '📊' },
];

function AddMissionModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('daily');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      description: description.trim(),
      recurrenceType,
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
        className="modal-content add-mission-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>🎯 Add New Mission</h3>
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
              placeholder="e.g., 20 pushups, Do laundry, Go to gym"
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
            <label>Recurrence</label>
            <div className="recurrence-selector">
              {recurrenceOptions.map((option) => (
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
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleAdd} disabled={!name.trim()}>
              Add Mission
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddMissionModal;
