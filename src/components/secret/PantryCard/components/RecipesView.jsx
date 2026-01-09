import { useEffect, useRef } from 'react';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';

function RecipesView({
  selectedRecipe,
  pantryItems,
  onBack,
  onEdit,
  onDelete,
  recipeSearch,
  onRecipeSearchChange,
  recipeSearchMode,
  onRecipeSearchModeChange,
  showRecipeSearch,
  selectedTag,
  onTagChange,
  allTags,
  recipes,
  recipeSort,
  onSortChange,
  onShowAddRecipe,
  totalRecipes,
  pageStart,
  pageEnd,
  recipePage,
  totalPages,
  onPageChange,
  pagedRecipes,
  onSelectRecipe,
}) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showRecipeSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showRecipeSearch]);

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        pantryItems={pantryItems}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <>
      <div className="recipes-header">
        <div className="recipe-filters">
          <select
            className="tag-filter-select"
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
          >
            <option value="all">All Tags ({recipes.length})</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag} ({recipes.filter(r => r.tags && r.tags.includes(tag)).length})
              </option>
            ))}
          </select>
        </div>
        <div className="recipe-header-actions">
          <select
            className="recipe-sort-select"
            value={recipeSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="score">Sort by Alex Score</option>
          </select>
          <button className="add-recipe-btn" onClick={onShowAddRecipe}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Recipe
          </button>
        </div>
      </div>

      {showRecipeSearch && (
        <div className="recipe-search-panel">
          <div className="recipe-search-modes">
            <button
              type="button"
              className={`search-mode-btn ${recipeSearchMode === 'name' ? 'active' : ''}`}
              onClick={() => onRecipeSearchModeChange('name')}
              aria-pressed={recipeSearchMode === 'name'}
            >
              Name
            </button>
            <button
              type="button"
              className={`search-mode-btn ${recipeSearchMode === 'ingredients' ? 'active' : ''}`}
              onClick={() => onRecipeSearchModeChange('ingredients')}
              aria-pressed={recipeSearchMode === 'ingredients'}
            >
              Ingredients
            </button>
          </div>
          <div className="recipe-search-input-row">
            <input
              ref={searchInputRef}
              className="recipe-search-input"
              type="text"
              value={recipeSearch}
              onChange={(e) => onRecipeSearchChange(e.target.value)}
              placeholder={
                recipeSearchMode === 'ingredients'
                  ? 'eggs, chicken, spinach...'
                  : 'Search recipe names...'
              }
            />
            {recipeSearch.trim() && (
              <button
                type="button"
                className="recipe-search-clear"
                onClick={() => onRecipeSearchChange('')}
              >
                Clear
              </button>
            )}
          </div>
          <p className="recipe-search-hint">
            {recipeSearchMode === 'ingredients'
              ? 'Enter ingredients separated by commas to find matching recipes.'
              : 'Type to filter recipes by name as you search.'}
          </p>
        </div>
      )}

      <div className="recipe-pagination">
        <span className="recipe-count">
          {totalRecipes === 0
            ? 'No recipes found'
            : `Showing ${pageStart + 1}-${pageEnd} of ${totalRecipes}`}
        </span>
        <div className="recipe-page-controls">
          <button
            className="page-btn"
            onClick={() => onPageChange(Math.max(recipePage - 1, 0))}
            disabled={recipePage === 0}
          >
            Prev
          </button>
          <span className="page-indicator">
            {totalPages === 0 ? 0 : recipePage + 1} / {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => onPageChange(Math.min(recipePage + 1, totalPages - 1))}
            disabled={recipePage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="recipes-grid">
        {pagedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelectRecipe(recipe)}
          />
        ))}
      </div>
    </>
  );
}

export default RecipesView;
