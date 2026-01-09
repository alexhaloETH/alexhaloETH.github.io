import { useEffect, useMemo } from 'react';
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
import { useAuth } from '../../../contexts/AuthContext';
import { TASK_TABS } from './TasksCard.constants';
import useTasksData from './useTasksData';
import './TasksCard.css';

function TasksCard() {
  const { showNotification } = useNotification();
  const { canRead, canWrite } = useAuth();
  const canReadTasks = canRead('tasks');
  const canReadNotes = canRead('notes');
  const canReadMissions = canRead('missions');
  const canWriteTasks = canWrite('tasks');
  const canWriteNotes = canWrite('notes');
  const canWriteMissions = canWrite('missions');
  const visibleTabs = useMemo(
    () => TASK_TABS.filter((tab) => canRead(tab.resource)),
    [canRead],
  );
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
    logMissionAmount,
  } = useTasksData(showNotification, {
    canReadTasks,
    canReadNotes,
    canReadMissions,
    canWriteTasks,
    canWriteNotes,
    canWriteMissions,
  });

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [activeTab, setActiveTab, visibleTabs]);

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <BaseCard className="card secret-card tasks-card">
      <TasksHeader
        activeTab={activeTab}
        activeCount={activeCount}
        missionsCount={missions.length}
        regularNotesCount={regularNotes.length}
        ideaNotesCount={ideaNotes.length}
        onTabChange={setActiveTab}
        tabs={visibleTabs}
      />

      <div className="tasks-content">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && canReadTasks && (
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
                onShowAddTask={canWriteTasks ? () => setShowAddTaskModal(true) : null}
                onToggleTask={canWriteTasks ? toggleTask : null}
                onEditTask={canWriteTasks ? setEditingTask : null}
                onClearCompleted={canWriteTasks ? clearCompletedTasks : null}
                canEdit={canWriteTasks}
              />
            </motion.div>
          )}

          {(activeTab === 'notes' || activeTab === 'ideas') && canReadNotes && (
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
                onShowAddNote={canWriteNotes ? () => setShowAddNoteModal(true) : null}
                onEditNote={canWriteNotes ? setEditingNote : null}
                onTogglePin={canWriteNotes ? togglePinNote : null}
                canEdit={canWriteNotes}
              />
            </motion.div>
          )}

          {activeTab === 'missions' && canReadMissions && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="missions-view"
            >
              <MissionsView
                missions={missions}
                onShowAddMission={canWriteMissions ? () => setShowAddMissionModal(true) : null}
                onToggleMission={canWriteMissions ? toggleMission : null}
                onEditMission={canWriteMissions ? setEditingMission : null}
                onOpenCalendar={setCalendarMission}
                onLogAmount={canWriteMissions ? logMissionAmount : null}
                canEdit={canWriteMissions}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingTask && canWriteTasks && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={updateTask}
            onDelete={deleteTask}
          />
        )}
        {showAddTaskModal && canWriteTasks && (
          <AddTaskModal
            onClose={() => setShowAddTaskModal(false)}
            onAdd={addTask}
          />
        )}
        {editingNote && canWriteNotes && (
          <EditNoteModal
            note={editingNote}
            onClose={() => setEditingNote(null)}
            onSave={updateNote}
            onDelete={deleteNote}
          />
        )}
        {showAddNoteModal && canWriteNotes && (
          <AddNoteModal
            onClose={() => setShowAddNoteModal(false)}
            onAdd={addNote}
            isIdea={activeTab === 'ideas'}
          />
        )}
        {editingMission && canWriteMissions && (
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
        {showAddMissionModal && canWriteMissions && (
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
