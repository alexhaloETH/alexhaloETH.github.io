import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import './TasksCard.css';

const initialTasks = [
  { id: 1, text: 'Review PR for Blob Arena', completed: false, priority: 'high', dueDate: 'Today' },
  { id: 2, text: 'Update portfolio website', completed: true, priority: 'medium', dueDate: 'Today' },
  { id: 3, text: 'Research Starknet upgrades', completed: false, priority: 'medium', dueDate: 'Tomorrow' },
  { id: 4, text: 'Team sync call', completed: false, priority: 'high', dueDate: 'Today' },
  { id: 5, text: 'Write dev blog post', completed: false, priority: 'low', dueDate: 'This week' },
  { id: 6, text: 'Fix trading bot memory leak', completed: false, priority: 'high', dueDate: 'Tomorrow' },
];

const dueDateOptions = ['Today', 'Tomorrow', 'This week', 'Next week', 'Later'];
const priorityOptions = ['high', 'medium', 'low'];

// Edit Task Modal
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

// Add Task Modal
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

function TasksCard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleTask = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <BaseCard className="card tasks-card">
      <div className="card-header">
        <div className="card-icon tasks">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div className="header-content">
          <h3>Tasks</h3>
          <div className="task-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({activeCount})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>
      </div>
      <div className="card-content">
        <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add new task</span>
        </button>
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
              >
                {task.completed && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
              </button>
              <div className="task-content" onClick={() => setEditingTask(task)}>
                <span className="task-text">{task.text}</span>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                  <span className="due-date">{task.dueDate}</span>
                </div>
              </div>
              <button className="edit-btn" onClick={() => setEditingTask(task)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <span className="task-summary">{activeCount} tasks remaining</span>
        {completedCount > 0 && (
          <button
            className="clear-completed"
            onClick={() => setTasks(tasks.filter((t) => !t.completed))}
          >
            Clear completed
          </button>
        )}
      </div>

      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={updateTask}
            onDelete={deleteTask}
          />
        )}
        {showAddModal && (
          <AddTaskModal
            onClose={() => setShowAddModal(false)}
            onAdd={addTask}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default TasksCard;
