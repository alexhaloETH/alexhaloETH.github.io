import { PANTRY_TABS } from '../PantryCard.constants';

function PantryHeader({
  activeTab,
  onTabChange,
  recipeCount,
  onFindRecipe,
  isSearchOpen,
  tabs,
}) {
  const visibleTabs = tabs || PANTRY_TABS;
  const hasRecipes = visibleTabs.some((tab) => tab.id === 'recipes');

  return (
    <div className="pantry-header">
      <div className="pantry-title-section">
        <div className="pantry-icon">
          <span>🍽️</span>
        </div>
        <div>
          <h3>Kitchen Hub</h3>
          {hasRecipes && (
            <span className="pantry-subtitle">
              {recipeCount} recipes total
            </span>
          )}
        </div>
      </div>
      <div className="pantry-header-actions">
        {hasRecipes && (
          <button
            type="button"
            className={`find-recipe-btn ${isSearchOpen ? 'active' : ''}`}
            onClick={onFindRecipe}
            aria-pressed={isSearchOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
            {isSearchOpen ? 'Hide Search' : 'Find Recipe'}
          </button>
        )}
        <div className="pantry-tabs">
          {visibleTabs.map((tab) => (
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
    </div>
  );
}

export default PantryHeader;
