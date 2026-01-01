import { useState } from 'react';
import { motion } from 'framer-motion';

function AddRecipeModal({ onClose, onAdd, emojis }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('15 min');
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState(2);
  const [icon, setIcon] = useState('🍳');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', amount: 1, unit: 'pcs', optional: false }]);
  const [steps, setSteps] = useState([{ instruction: '', tip: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'pcs', optional: false }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients(ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const handleAddStep = () => {
    setSteps([...steps, { instruction: '', tip: '' }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    setSteps(steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const validIngredients = ingredients.filter(i => i.name.trim());
    const validSteps = steps.filter(s => s.instruction.trim());

    if (validIngredients.length === 0) return;
    if (validSteps.length === 0) return;

    onAdd({
      name: name.trim(),
      time,
      difficulty,
      servings,
      icon,
      url: null,
      ingredients: validIngredients.map(i => ({
        name: i.name,
        amount: Number(i.amount),
        unit: i.unit,
        optional: i.optional || false
      })),
      steps: validSteps.map(s => ({
        instruction: s.instruction,
        tip: s.tip || null,
        image: null,
        url: null
      })),
    });
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content modal-xlarge"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add New Recipe</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} id="recipe-form" className="modal-body recipe-form">
          {/* Basic Info */}
          <div className="form-section">
            <h4>Basic Info</h4>
            <div className="form-row">
              <div className="form-group icon-picker-group">
                <label>Icon</label>
                <button
                  type="button"
                  className="icon-picker-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {icon}
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={emoji === icon ? 'selected' : ''}
                        onClick={() => {
                          setIcon(emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group flex-grow">
                <label>Recipe Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Spaghetti Bolognese"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="5 min">5 min</option>
                  <option value="10 min">10 min</option>
                  <option value="15 min">15 min</option>
                  <option value="20 min">20 min</option>
                  <option value="25 min">25 min</option>
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  min="1"
                  max="12"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-section">
            <div className="section-header">
              <h4>Ingredients</h4>
              <button type="button" className="add-row-btn" onClick={handleAddIngredient}>
                + Add
              </button>
            </div>
            <div className="ingredients-editor">
              {ingredients.map((ing, index) => (
                <div key={index} className="ingredient-row-editor">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    min="0"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  >
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="cloves">cloves</option>
                    <option value="slices">slices</option>
                  </select>
                  <label className="optional-checkbox">
                    <input
                      type="checkbox"
                      checked={ing.optional || false}
                      onChange={(e) => handleIngredientChange(index, 'optional', e.target.checked)}
                    />
                    <span>Optional</span>
                  </label>
                  <button
                    type="button"
                    className="remove-row-btn"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="form-section">
            <div className="section-header">
              <h4>Steps</h4>
              <button type="button" className="add-row-btn" onClick={handleAddStep}>
                + Add
              </button>
            </div>
            <div className="steps-editor">
              {steps.map((step, index) => (
                <div key={index} className="step-row-editor">
                  <span className="step-number">{index + 1}</span>
                  <div className="step-inputs">
                    <input
                      type="text"
                      placeholder="Step instruction..."
                      value={step.instruction}
                      onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Tip (optional)"
                      value={step.tip}
                      onChange={(e) => handleStepChange(index, 'tip', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-row-btn"
                    onClick={() => handleRemoveStep(index)}
                    disabled={steps.length === 1}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={!name.trim()} form="recipe-form">
            Create Recipe
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddRecipeModal;
