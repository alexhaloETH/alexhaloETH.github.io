import { PANTRY_TABS } from '../PantryCard.constants';

function PantryHeader({ activeTab, onTabChange, recipeCount }) {
  return (
    <div className="pantry-header">
      <div className="pantry-title-section">
        <div className="pantry-icon">
          <span>🍽️</span>
        </div>
        <div>
          <h3>Kitchen Hub</h3>
          <span className="pantry-subtitle">
            {recipeCount} recipes total
          </span>
        </div>
      </div>
      <div className="pantry-tabs">
        {PANTRY_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pantry-tab ${activeTab === tab.id ? 'active' : ''}`}
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

export default PantryHeader;
