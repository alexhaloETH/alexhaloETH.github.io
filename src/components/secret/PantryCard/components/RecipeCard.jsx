function RecipeCard({ recipe, onClick }) {
  return (
    <button className="recipe-card" onClick={onClick}>
      <div className="recipe-icon">{recipe.icon}</div>
      <div className="recipe-info">
        <span className="recipe-name">{recipe.name}</span>
        <div className="recipe-meta">
          <span className="recipe-time">{recipe.time}</span>
          <span className={`recipe-difficulty ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      {recipe.canMake ? (
        <div className="recipe-status ready">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
      ) : (
        <div className="recipe-status missing">
          <span>{recipe.missing.length}</span>
        </div>
      )}
    </button>
  );
}

export default RecipeCard;
