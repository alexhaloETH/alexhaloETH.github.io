import { useState } from 'react';
import { motion } from 'framer-motion';

const dueDateOptions = ['Today', 'Tomorrow', 'This week', 'Next week', 'Later'];
const priorityOptions = ['high', 'medium', 'low'];

function TaskFormModal({
  title,
  submitLabel,
  textPlaceholder,
  onClose,
  onSubmit,
  onDelete,
  initialTask,
  modalClassName,
  disableSubmitWhenEmpty = true,
}) {
  const [text, setText] = useState(initialTask?.text || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || 'Today');

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (initialTask) {
      onSubmit({
        ...initialTask,
        text: text.trim(),
        priority,
        dueDate,
      });
    } else {
      onSubmit({
        id: Date.now(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!initialTask || !onDelete) {
      return;
    }

    onDelete(initialTask.id);
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
        className={`modal-content ${modalClassName}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
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
              placeholder={textPlaceholder}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <div className="priority-selector">
                {priorityOptions.map((option) => (
                  <button
                    key={option}
                    className={`priority-btn ${option} ${priority === option ? 'active' : ''}`}
                    onClick={() => setPriority(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}>
                {dueDateOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {onDelete && initialTask && (
            <button className="btn-delete" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
              </svg>
              Delete
            </button>
          )}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button
              className="btn-save"
              onClick={handleSubmit}
              disabled={disableSubmitWhenEmpty && !text.trim()}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TaskFormModal;
