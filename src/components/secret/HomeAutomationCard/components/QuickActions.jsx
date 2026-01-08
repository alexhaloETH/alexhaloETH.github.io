function QuickActions({ actions }) {
  return (
    <div className="automation-section">
      <h4 className="section-label">Quick Actions</h4>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="action-btn"
            onClick={action.action}
          >
            {action.icon}
            <span>{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
