import { motion, AnimatePresence } from 'framer-motion';

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

export default CookingMode;
