import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  pantryItems,
  shoppingList,
  getRecipesByAvailability,
} from '../../../data/secret/pantry';
import './PantryCard.css';

const tabs = [
  { id: 'recipes', label: 'What Can I Make?', icon: '🍳' },
  { id: 'pantry', label: 'Pantry', icon: '🏠' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
];

function PantryCard() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const sortedRecipes = useMemo(
    () => getRecipesByAvailability(pantryItems),
    []
  );

  const availableRecipes = sortedRecipes.filter((r) => r.canMake);
  const almostRecipes = sortedRecipes.filter(
    (r) => !r.canMake && r.matchPercentage >= 60
  );

  return (
    <BaseCard className="card secret-card pantry-card wide">
      <div className="pantry-header">
        <div className="pantry-title-section">
          <div className="pantry-icon">
            <span>🍽️</span>
          </div>
          <div>
            <h3>Kitchen Hub</h3>
            <span className="pantry-subtitle">
              {availableRecipes.length} recipes ready to make
            </span>
          </div>
        </div>
        <div className="pantry-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pantry-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pantry-content">
        <AnimatePresence mode="wait">
          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="recipes-view"
            >
              {selectedRecipe ? (
                <RecipeDetail
                  recipe={selectedRecipe}
                  onBack={() => setSelectedRecipe(null)}
                />
              ) : (
                <>
                  {availableRecipes.length > 0 && (
                    <div className="recipe-section">
                      <h4 className="section-label ready">
                        <span className="dot" />
                        Ready to Cook
                      </h4>
                      <div className="recipes-grid">
                        {availableRecipes.map((recipe) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {almostRecipes.length > 0 && (
                    <div className="recipe-section">
                      <h4 className="section-label almost">
                        <span className="dot" />
                        Almost There
                      </h4>
                      <div className="recipes-grid">
                        {almostRecipes.map((recipe) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'pantry' && (
            <motion.div
              key="pantry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pantry-view"
            >
              <div className="pantry-grid">
                {pantryItems.map((item) => (
                  <div key={item.id} className="pantry-item">
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div
                      className={`item-status ${
                        item.quantity < 3 ? 'low' : 'ok'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="shopping-view"
            >
              <div className="shopping-list-full">
                {shoppingList.map((item) => (
                  <div
                    key={item.id}
                    className={`shopping-item-full ${
                      item.checked ? 'checked' : ''
                    }`}
                  >
                    <div
                      className={`checkbox ${item.checked ? 'checked' : ''}`}
                    />
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="shopping-footer">
                <span>
                  {shoppingList.filter((i) => !i.checked).length} items
                  remaining
                </span>
                <button className="add-item-btn">+ Add Item</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseCard>
  );
}

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

function RecipeDetail({ recipe, onBack }) {
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
      <button className="back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

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

function CookingMode({ recipe, currentStep, completedSteps, onStepComplete, onStepSelect, onExit }) {
  const step = recipe.steps[currentStep];
  const isLastStep = currentStep === recipe.steps.length - 1;
  const allComplete = completedSteps.length === recipe.steps.length;

  return (
    <div className="cooking-mode">
      <div className="cooking-header">
        <button className="exit-cooking-btn" onClick={onExit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="cooking-title">
          <span className="cooking-icon">{recipe.icon}</span>
          <span>{recipe.name}</span>
        </div>
        <div className="cooking-progress">
          <span>{completedSteps.length}/{recipe.steps.length}</span>
        </div>
      </div>

      <div className="steps-timeline">
        {recipe.steps.map((s, i) => (
          <button
            key={i}
            className={`step-dot ${i === currentStep ? 'active' : ''} ${completedSteps.includes(i) ? 'completed' : ''}`}
            onClick={() => onStepSelect(i)}
          >
            {completedSteps.includes(i) ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="step-content"
        >
          <div className="step-number">Step {currentStep + 1}</div>
          <p className="step-instruction">{step.instruction}</p>
          {step.tip && (
            <div className="step-tip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>{step.tip}</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="cooking-actions">
        <button
          className="prev-step-btn"
          onClick={() => onStepSelect(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {allComplete ? (
          <button className="finish-btn" onClick={onExit}>
            <span>Done!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </button>
        ) : (
          <button
            className="complete-step-btn"
            onClick={() => onStepComplete(currentStep)}
          >
            {completedSteps.includes(currentStep) ? (
              isLastStep ? 'Finish' : 'Next Step'
            ) : (
              'Mark Complete'
            )}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {completedSteps.includes(currentStep) ? (
                <path d="M5 12h14M12 5l7 7-7 7" />
              ) : (
                <polyline points="20,6 9,17 4,12" />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default PantryCard;
