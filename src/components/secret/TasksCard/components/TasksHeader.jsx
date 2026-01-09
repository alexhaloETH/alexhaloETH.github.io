import { TASK_TABS } from '../TasksCard.constants';

function TasksHeader({
  activeTab,
  activeCount,
  missionsCount,
  regularNotesCount,
  ideaNotesCount,
  onTabChange,
  tabs,
}) {
  const subtitle = () => {
    if (activeTab === 'tasks') return `${activeCount} tasks remaining`;
    if (activeTab === 'missions') return `${missionsCount} missions`;
    if (activeTab === 'notes') return `${regularNotesCount} notes`;
    if (activeTab === 'ideas') return `${ideaNotesCount} ideas`;
    return '';
  };

  return (
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
          <span className="tasks-subtitle">{subtitle()}</span>
        </div>
      </div>
      <div className="tasks-tabs">
        {(tabs || TASK_TABS).map((tab) => (
          <button
            key={tab.id}
            className={`tasks-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TasksHeader;
