function TasksView({
  filter,
  activeCount,
  completedCount,
  filteredTasks,
  onFilterChange,
  onShowAddTask,
  onToggleTask,
  onEditTask,
  onClearCompleted,
  canEdit,
}) {
  return (
    <>
      <div className="task-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => onFilterChange('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Done ({completedCount})
        </button>
      </div>
      {canEdit && (
        <button className="add-task-btn" onClick={onShowAddTask}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add new task</span>
        </button>
      )}
      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <button
              className={`task-checkbox ${task.completed ? 'checked' : ''}`}
              onClick={canEdit ? (e) => {
                e.stopPropagation();
                onToggleTask(task.id);
              } : undefined}
            >
              {task.completed && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              )}
            </button>
            <div className="task-content" onClick={canEdit ? () => onEditTask(task) : undefined}>
              <span className="task-text">{task.text}</span>
              <div className="task-meta">
                <span className={`priority ${task.priority}`}>{task.priority}</span>
                <span className="due-date">{task.dueDate}</span>
              </div>
            </div>
            {canEdit && (
              <button className="edit-btn" onClick={() => onEditTask(task)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {completedCount > 0 && canEdit && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </>
  );
}

export default TasksView;
