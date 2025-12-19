import { useState } from 'react';
import { motion } from 'framer-motion';

const dueDateOptions = ['Today', 'Tomorrow', 'This week', 'Next week', 'Later'];
const priorityOptions = ['high', 'medium', 'low'];

function EditTaskModal({ task, onClose, onSave, onDelete }) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ ...task, text: text.trim(), priority, dueDate });
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
        className="modal-content edit-task-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Edit Task</h3>
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
              placeholder="Enter task description..."
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
          <button className="btn-delete" onClick={() => { onDelete(task.id); onClose(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
            </svg>
            Delete
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EditTaskModal;
