import { useState } from 'react';
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

function TasksCard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  const toggleTask = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: 'medium',
        dueDate: 'Today',
      },
    ]);
    setNewTask('');
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
        <form className="add-task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="add-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </form>
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
              </button>
              <div className="task-content">
                <span className="task-text">{task.text}</span>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                  <span className="due-date">{task.dueDate}</span>
                </div>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
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
    </BaseCard>
  );
}

export default TasksCard;
