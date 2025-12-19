import { useState } from 'react';
import { motion } from 'framer-motion';

const dueDateOptions = ['Today', 'Tomorrow', 'This week', 'Next week', 'Later'];
const priorityOptions = ['high', 'medium', 'low'];

function AddTaskModal({ onClose, onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('Today');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
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
        className="modal-content add-task-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add New Task</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Task</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <div className="priority-selector">
                {priorityOptions.map((p) => (
                  <button
                    key={p}
                    className={`priority-btn ${p} ${priority === p ? 'active' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}>
                {dueDateOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleAdd} disabled={!text.trim()}>Add Task</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddTaskModal;
