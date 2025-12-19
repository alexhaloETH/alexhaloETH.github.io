import { useState } from 'react';
import CookingMode from './CookingMode';

function RecipeDetail({ recipe, pantryItems, onBack, onDelete }) {
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStartCooking = () => {
    setCookingMode(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < recipe.steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleExitCooking = () => {
    setCookingMode(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (cookingMode) {
    return (
      <CookingMode
        recipe={recipe}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepComplete={handleStepComplete}
        onStepSelect={setCurrentStep}
        onExit={handleExitCooking}
      />
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-actions">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button className="delete-recipe-btn" onClick={onDelete}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
          </svg>
        </button>
      </div>

      <div className="recipe-detail-header">
        <span className="detail-icon">{recipe.icon}</span>
        <div>
          <h3>{recipe.name}</h3>
          <div className="detail-meta">
            <span>{recipe.time}</span>
            <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
            {recipe.servings && (
              <span className="servings">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>

      <div className="ingredients-list">
        <h4>Ingredients</h4>
        {recipe.ingredients.map((ing, i) => {
          const pantryItem = pantryItems.find(
            (p) => p.name.toLowerCase() === ing.name.toLowerCase()
          );
          const hasEnough = pantryItem && pantryItem.quantity >= ing.amount;

          return (
            <div
              key={i}
              className={`ingredient-row ${hasEnough ? 'have' : 'need'}`}
            >
              <span className="ing-icon">
                {pantryItem?.icon || '📦'}
              </span>
              <span className="ing-name">{ing.name}</span>
              <span className="ing-amount">
                {ing.amount} {ing.unit}
              </span>
              <span className="ing-status">
                {hasEnough ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  <span className="need-label">
                    Need {ing.amount - (pantryItem?.quantity || 0)}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {recipe.canMake && recipe.steps && (
        <button className="start-cooking-btn" onClick={handleStartCooking}>
          <span>Start Cooking</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default RecipeDetail;
