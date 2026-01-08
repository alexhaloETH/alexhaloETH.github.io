import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  AddMissionModal,
  AddNoteModal,
  AddTaskModal,
  EditMissionModal,
  EditNoteModal,
  EditTaskModal,
  MissionCalendarModal,
  MissionsView,
  NotesView,
  TasksHeader,
  TasksView,
} from './components';
import { useNotification } from '../../../contexts/NotificationContext';
import useTasksData from './useTasksData';
import './TasksCard.css';

function TasksCard() {
  const { showNotification } = useNotification();
  const {
    activeTab,
    setActiveTab,
    filter,
    setFilter,
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
  } = useTasksData(showNotification);

  return (
    <BaseCard className="card secret-card tasks-card">
      <TasksHeader
        activeTab={activeTab}
        activeCount={activeCount}
        missionsCount={missions.length}
        regularNotesCount={regularNotes.length}
        ideaNotesCount={ideaNotes.length}
        onTabChange={setActiveTab}
      />

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
              <TasksView
                filter={filter}
                activeCount={activeCount}
                completedCount={completedCount}
                filteredTasks={filteredTasks}
                onFilterChange={setFilter}
                onShowAddTask={() => setShowAddTaskModal(true)}
                onToggleTask={toggleTask}
                onEditTask={setEditingTask}
                onClearCompleted={clearCompletedTasks}
              />
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
              <NotesView
                activeTab={activeTab}
                currentNotes={currentNotes}
                onShowAddNote={() => setShowAddNoteModal(true)}
                onEditNote={setEditingNote}
                onTogglePin={togglePinNote}
              />
            </motion.div>
          )}

          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="missions-view"
            >
              <MissionsView
                missions={missions}
                onShowAddMission={() => setShowAddMissionModal(true)}
                onToggleMission={toggleMission}
                onEditMission={setEditingMission}
                onOpenCalendar={setCalendarMission}
              />
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
        {editingMission && (
          <EditMissionModal
            mission={editingMission}
            onClose={() => setEditingMission(null)}
            onSave={updateMission}
            onDelete={deleteMission}
          />
        )}
        {calendarMission && (
          <MissionCalendarModal
            mission={calendarMission}
            onClose={() => setCalendarMission(null)}
          />
        )}
        {showAddMissionModal && (
          <AddMissionModal
            onClose={() => setShowAddMissionModal(false)}
            onAdd={addMission}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default TasksCard;
