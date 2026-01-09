import { useEffect, useMemo, useState } from 'react';
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
import {
  getAllMissions,
  createMission,
  updateMission as updateMissionAPI,
  completeMission as completeMissionAPI,
  logMissionAmount as logMissionAmountAPI,
  deleteMission as deleteMissionAPI,
} from '../../../utils/missionsApi';
import {
  uploadImage,
} from '../../../utils/imagesApi';

const useTasksData = (showNotification) => {
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

  // Missions state
  const [missions, setMissions] = useState([]);
  const [editingMission, setEditingMission] = useState(null);
  const [showAddMissionModal, setShowAddMissionModal] = useState(false);
  const [calendarMission, setCalendarMission] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedTasks, fetchedNotes, fetchedMissions] = await Promise.all([
          getAllTasks(),
          getAllNotes(),
          getAllMissions(),
        ]);
        setTasks(fetchedTasks);
        setNotes(fetchedNotes);
        setMissions(fetchedMissions);
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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

  const clearCompletedTasks = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks(tasks.filter((t) => !t.completed));

    try {
      await Promise.all(completedTasks.map(t => deleteTaskAPI(t.id)));
      showNotification({
        title: 'Success',
        message: 'Completed tasks cleared',
        type: 'success',
      });
    } catch {
      setTasks([...tasks]);
      showNotification({
        title: 'Error',
        message: 'Failed to clear completed tasks',
        type: 'error',
      });
    }
  };

  // Note handlers
  const addNote = async (newNote) => {
    try {
      const { images, ...noteData } = newNote;
      const data = {
        ...noteData,
        category: activeTab === 'ideas' ? 'ideas' : 'notes',
      };

      // Create the note first
      const createdNote = await createNoteAPI(data);

      // Upload images if any
      if (images && images.length > 0) {
        const entityType = activeTab === 'ideas' ? 'idea' : 'note';
        await Promise.all(
          images.map((image) => uploadImage(entityType, createdNote.id, image))
        );
      }

      const fetchedNotes = await getAllNotes();
      setNotes(fetchedNotes);
      setShowAddNoteModal(false);
      showNotification({
        title: 'Success',
        message: activeTab === 'ideas' ? 'Idea added' : 'Note added',
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      showNotification({
        title: 'Error',
        message: activeTab === 'ideas' ? 'Failed to add idea' : 'Failed to add note',
        type: 'error',
      });
    }
  };

  const updateNote = async (updatedNote) => {
    const originalNote = notes.find(n => n.id === updatedNote.id);
    const { images, ...noteData } = updatedNote;

    setNotes(notes.map((note) =>
      note.id === updatedNote.id ? noteData : note
    ));

    try {
      await updateNoteAPI(updatedNote.id, noteData);

      // Upload new images if any
      if (images && images.length > 0) {
        const entityType = noteData.category === 'ideas' ? 'idea' : 'note';
        await Promise.all(
          images.map((image) => uploadImage(entityType, noteData.id, image))
        );
      }

      setEditingNote(null);
      showNotification({
        title: 'Success',
        message: 'Note updated',
        type: 'success',
      });
    } catch {
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
    } catch {
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
    } catch {
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

  // Mission handlers
  const toggleMission = async (id) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    const newCompleted = !mission.completed;
    setMissions(missions.map((m) =>
      m.id === id ? { ...m, completed: newCompleted } : m
    ));

    try {
      await completeMissionAPI(id, newCompleted);
      const refreshedMissions = await getAllMissions();
      setMissions(refreshedMissions);
    } catch {
      setMissions(missions.map((m) =>
        m.id === id ? mission : m
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to update mission',
        type: 'error',
      });
    }
  };

  const addMission = async (newMission) => {
    try {
      await createMission(newMission);

      const fetchedMissions = await getAllMissions();
      setMissions(fetchedMissions);
      setShowAddMissionModal(false);
      showNotification({
        title: 'Success',
        message: 'Mission added',
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding mission:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add mission',
        type: 'error',
      });
    }
  };

  const updateMission = async (updatedMission) => {
    const originalMission = missions.find(m => m.id === updatedMission.id);

    setMissions(missions.map((mission) =>
      mission.id === updatedMission.id ? updatedMission : mission
    ));

    try {
      await updateMissionAPI(updatedMission.id, updatedMission);

      setEditingMission(null);
      showNotification({
        title: 'Success',
        message: 'Mission updated',
        type: 'success',
      });
    } catch {
      setMissions(missions.map((mission) =>
        mission.id === updatedMission.id ? originalMission : mission
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to update mission',
        type: 'error',
      });
    }
  };

  const deleteMission = async (id) => {
    const missionToDelete = missions.find(m => m.id === id);

    setMissions(missions.filter((mission) => mission.id !== id));

    try {
      await deleteMissionAPI(id);
      setEditingMission(null);
      showNotification({
        title: 'Success',
        message: 'Mission deleted',
        type: 'success',
      });
    } catch {
      if (missionToDelete) {
        setMissions([...missions, missionToDelete]);
      }
      showNotification({
        title: 'Error',
        message: 'Failed to delete mission',
        type: 'error',
      });
    }
  };

  const logMissionAmount = async (id, amount) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    const optimisticMission = {
      ...mission,
      currentAmount: amount,
      lastCompletedAt: new Date().toISOString(),
    };

    setMissions(missions.map((m) =>
      m.id === id ? optimisticMission : m
    ));

    try {
      await logMissionAmountAPI(id, amount);
      const refreshedMissions = await getAllMissions();
      setMissions(refreshedMissions);
    } catch {
      setMissions(missions.map((m) =>
        m.id === id ? mission : m
      ));
      showNotification({
        title: 'Error',
        message: 'Failed to log mission amount',
        type: 'error',
      });
    }
  };

  // Derived data
  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed);
    if (filter === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }, [filter, tasks]);

  const regularNotes = useMemo(() => notes.filter(n => n.category === 'notes'), [notes]);
  const ideaNotes = useMemo(() => notes.filter(n => n.category === 'ideas'), [notes]);

  const currentNotes = useMemo(() => (
    activeTab === 'notes' ? regularNotes : ideaNotes
  ), [activeTab, ideaNotes, regularNotes]);

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  return {
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    tasks,
    notes,
    missions,
    filteredTasks,
    regularNotes,
    ideaNotes,
    currentNotes,
    completedCount,
    activeCount,
    editingTask,
    setEditingTask,
    showAddTaskModal,
    setShowAddTaskModal,
    editingNote,
    setEditingNote,
    showAddNoteModal,
    setShowAddNoteModal,
    editingMission,
    setEditingMission,
    showAddMissionModal,
    setShowAddMissionModal,
    calendarMission,
    setCalendarMission,
    isLoading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    clearCompletedTasks,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    toggleMission,
    addMission,
    updateMission,
    deleteMission,
    logMissionAmount,
  };
};

export default useTasksData;
