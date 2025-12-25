import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { EditTaskModal, AddTaskModal, EditNoteModal, AddNoteModal } from './components';
import { useNotification } from '../../../contexts/NotificationContext';
import {
  getAllTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from '../../../utils/taskApi';
import {
  getAllNotes,
  createNote as createNoteAPI,
  updateNote as updateNoteAPI,
  deleteNote as deleteNoteAPI,
} from '../../../utils/notesApi';
import './TasksCard.css';

const tabs = [
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'notes', label: 'Notes', icon: '📝' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
];

function TasksCard() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('tasks');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedTasks, fetchedNotes] = await Promise.all([
          getAllTasks(),
          getAllNotes(),
        ]);
        setTasks(fetchedTasks);
        setNotes(fetchedNotes);
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to load data. Make sure the backend is running on localhost:8080',
          type: 'error',
        });
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showNotification]);

  // Task handlers
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };

    setTasks(tasks.map((t) =>
      t.id === id ? updatedTask : t
    ));

    try {
      await updateTaskAPI(id, updatedTask);
    } catch (error) {
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
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
      setShowAddTaskModal(false);
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

  // Note handlers
  const addNote = async (newNote) => {
    try {
      const noteData = {
        ...newNote,
        category: activeTab === 'ideas' ? 'ideas' : 'notes',
      };
      await createNoteAPI(noteData);
      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
      setShowAddNoteModal(false);
      showNotification({
        title: 'Success',
        message: activeTab === 'ideas' ? 'Idea added' : 'Note added',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: activeTab === 'ideas' ? 'Failed to add idea' : 'Failed to add note',
        type: 'error',
      });
    }
  };

  const updateNote = async (updatedNote) => {
    const originalNote = notes.find(n => n.id === updatedNote.id);

    setNotes(notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    ));

    try {
      await updateNoteAPI(updatedNote.id, updatedNote);
      setEditingNote(null);
      showNotification({
        title: 'Success',
        message: 'Note updated',
        type: 'success',
      });
    } catch (error) {
      setNotes(notes.map((note) =>
        note.id === updatedNote.id ? originalNote : note
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to update note',
        type: 'error',
      });
    }
  };

  const deleteNote = async (id) => {
    const noteToDelete = notes.find(n => n.id === id);

    setNotes(notes.filter((note) => note.id !== id));

    try {
      await deleteNoteAPI(id);
      setEditingNote(null);
      showNotification({
        title: 'Success',
        message: 'Note deleted',
        type: 'success',
      });
    } catch (error) {
      if (noteToDelete) {
        setNotes([...notes, noteToDelete]);
      }
      showNotification({
        title: 'Error',
        message: 'Failed to delete note',
        type: 'error',
      });
    }
  };

  const togglePinNote = async (id) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const updatedNote = { ...note, pinned: !note.pinned };

    setNotes(notes.map((n) =>
      n.id === id ? updatedNote : n
    ));

    try {
      await updateNoteAPI(id, updatedNote);
    } catch (error) {
      setNotes(notes.map((n) =>
        n.id === id ? note : n
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to pin note',
        type: 'error',
      });
    }
  };

  // Filtered data
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const regularNotes = notes.filter(n => n.category === 'notes');
  const ideaNotes = notes.filter(n => n.category === 'ideas');

  const currentNotes = activeTab === 'notes' ? regularNotes : ideaNotes;

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <BaseCard className="card tasks-card">
      <div className="tasks-header">
        <div className="tasks-title-section">
          <div className="tasks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h3>Task Manager</h3>
            <span className="tasks-subtitle">
              {activeTab === 'tasks' && `${activeCount} tasks remaining`}
              {activeTab === 'notes' && `${regularNotes.length} notes`}
              {activeTab === 'ideas' && `${ideaNotes.length} ideas`}
            </span>
          </div>
        </div>
        <div className="tasks-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tasks-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tasks-content">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="tasks-view"
            >
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
              <button className="add-task-btn" onClick={() => setShowAddTaskModal(true)}>
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
              {completedCount > 0 && (
                <button
                  className="clear-completed"
                  onClick={async () => {
                    const completedTasks = tasks.filter((t) => t.completed);
                    setTasks(tasks.filter((t) => !t.completed));

                    try {
                      await Promise.all(completedTasks.map(t => deleteTaskAPI(t.id)));
                      showNotification({
                        title: 'Success',
                        message: 'Completed tasks cleared',
                        type: 'success',
                      });
                    } catch (error) {
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
            </motion.div>
          )}

          {(activeTab === 'notes' || activeTab === 'ideas') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="notes-view"
            >
              <button className="add-note-btn" onClick={() => setShowAddNoteModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add new {activeTab === 'notes' ? 'note' : 'idea'}</span>
              </button>
              <div className="notes-grid">
                {currentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="note-card"
                    style={{ borderLeftColor: note.color }}
                    onClick={() => setEditingNote(note)}
                  >
                    <div className="note-header">
                      <h4>{note.title}</h4>
                      <button
                        className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="note-content">{note.content}</p>
                    <div className="note-footer">
                      <span className="note-date">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {showAddTaskModal && (
          <AddTaskModal
            onClose={() => setShowAddTaskModal(false)}
            onAdd={addTask}
          />
        )}
        {editingNote && (
          <EditNoteModal
            note={editingNote}
            onClose={() => setEditingNote(null)}
            onSave={updateNote}
            onDelete={deleteNote}
          />
        )}
        {showAddNoteModal && (
          <AddNoteModal
            onClose={() => setShowAddNoteModal(false)}
            onAdd={addNote}
            isIdea={activeTab === 'ideas'}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default TasksCard;
