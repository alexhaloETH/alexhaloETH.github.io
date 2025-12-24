import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { EditTaskModal, AddTaskModal } from './components';
import { useNotification } from '../../../contexts/NotificationContext';
import {
  getAllTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from '../../../utils/taskApi';
import './TasksCard.css';

function TasksCard() {
  const { showNotification } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to load tasks. Make sure the backend is running on localhost:8080',
          type: 'error',
        });
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [showNotification]);

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };

    // Optimistic update
    setTasks(tasks.map((t) =>
      t.id === id ? updatedTask : t
    ));

    try {
      await updateTaskAPI(id, updatedTask);
    } catch (error) {
      // Revert on error
      setTasks(tasks.map((t) =>
        t.id === id ? task : t
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to update task',
        type: 'error',
      });
    }
  };

  const addTask = async (newTask) => {
    try {
      await createTask(newTask);
      // Refetch all tasks
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
      setShowAddModal(false);
      showNotification({
        title: 'Success',
        message: 'Task added',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to add task',
        type: 'error',
      });
    }
  };

  const updateTask = async (updatedTask) => {
    const originalTask = tasks.find(t => t.id === updatedTask.id);

    // Optimistic update
    setTasks(tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    ));

    try {
      await updateTaskAPI(updatedTask.id, updatedTask);
      setEditingTask(null);
      showNotification({
        title: 'Success',
        message: 'Task updated',
        type: 'success',
      });
    } catch (error) {
      // Revert on error
      setTasks(tasks.map((task) =>
        task.id === updatedTask.id ? originalTask : task
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to update task',
        type: 'error',
      });
    }
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);

    // Optimistic delete
    setTasks(tasks.filter((task) => task.id !== id));

    try {
      await deleteTaskAPI(id);
      setEditingTask(null);
      showNotification({
        title: 'Success',
        message: 'Task deleted',
        type: 'success',
      });
    } catch (error) {
      // Revert on error
      if (taskToDelete) {
        setTasks([...tasks, taskToDelete]);
      }
      showNotification({
        title: 'Error',
        message: 'Failed to delete task',
        type: 'error',
      });
    }
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
            onClick={async () => {
              const completedTasks = tasks.filter((t) => t.completed);
              // Optimistically remove completed tasks
              setTasks(tasks.filter((t) => !t.completed));

              try {
                // Delete all completed tasks
                await Promise.all(completedTasks.map(t => deleteTaskAPI(t.id)));
                showNotification({
                  title: 'Success',
                  message: 'Completed tasks cleared',
                  type: 'success',
                });
              } catch (error) {
                // Revert on error
                setTasks([...tasks]);
                showNotification({
                  title: 'Error',
                  message: 'Failed to clear completed tasks',
                  type: 'error',
                });
              }
            }}
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
