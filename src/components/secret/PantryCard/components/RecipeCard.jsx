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
          {recipe.alex_score && (
            <span className="recipe-card-score">⭐ {recipe.alex_score}</span>
          )}
        </div>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="recipe-card-tag">{tag}</span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="recipe-card-tag-more">+{recipe.tags.length - 3}</span>
            )}
          </div>
        )}
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
