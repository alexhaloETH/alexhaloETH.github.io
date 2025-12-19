import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  pantryItems as initialPantryItems,
  shoppingList as initialShoppingList,
  recipes as initialRecipes,
  canMakeRecipe,
} from '../../../data/secret/pantry';
import './PantryCard.css';

const tabs = [
  { id: 'recipes', label: 'What Can I Make?', icon: '🍳' },
  { id: 'pantry', label: 'Pantry', icon: '🏠' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
];

const categories = [
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'meat', label: 'Meat', icon: '🥩' },
  { id: 'seafood', label: 'Seafood', icon: '🦐' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'bakery', label: 'Bakery', icon: '🍞' },
  { id: 'pantry', label: 'Pantry', icon: '🏠' },
];

const commonEmojis = ['🥚', '🥛', '🧈', '🍞', '🧀', '🥓', '🍅', '🧅', '🧄', '🍝', '🍚', '🍗', '🫑', '🍄', '🫒', '🥔', '🥕', '🥒', '🥬', '🌽', '🥦', '🍎', '🍌', '🍊', '🍓', '🍇', '🥩', '🦐', '🌾', '🧂', '🌶️', '🫗', '🍯', '🥑', '🍋', '🐟', '☕', '🥜', '🥥', '🫘'];

function PantryCard() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pantryItems, setPantryItems] = useState(initialPantryItems);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [recipes, setRecipes] = useState(initialRecipes);

  // Modal states
  const [editingItem, setEditingItem] = useState(null);
  const [showAddPantryModal, setShowAddPantryModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showAddShoppingModal, setShowAddShoppingModal] = useState(false);

  const sortedRecipes = useMemo(() => {
    return recipes
      .map((recipe) => {
        const { canMake, missing } = canMakeRecipe(recipe, pantryItems);
        const matchedCount = recipe.ingredients.length - missing.length;
        const matchPercentage = (matchedCount / recipe.ingredients.length) * 100;
        return { ...recipe, canMake, missing, matchPercentage, matchedCount };
      })
      .sort((a, b) => {
        if (a.canMake && !b.canMake) return -1;
        if (!a.canMake && b.canMake) return 1;
        return b.matchPercentage - a.matchPercentage;
      });
  }, [pantryItems, recipes]);

  const availableRecipes = sortedRecipes.filter((r) => r.canMake);
  const almostRecipes = sortedRecipes.filter(
    (r) => !r.canMake && r.matchPercentage >= 60
  );

  // Pantry item handlers
  const handleUpdateQuantity = (id, newQuantity) => {
    setPantryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const handleDeletePantryItem = (id) => {
    setPantryItems(items => items.filter(item => item.id !== id));
  };

  const handleAddPantryItem = (newItem) => {
    const id = Math.max(...pantryItems.map(i => i.id), 0) + 1;
    setPantryItems([...pantryItems, { ...newItem, id }]);
    setShowAddPantryModal(false);
  };

  // Shopping list handlers
  const handleToggleShoppingItem = (id) => {
    setShoppingList(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteShoppingItem = (id) => {
    setShoppingList(items => items.filter(item => item.id !== id));
  };

  const handleAddShoppingItem = (newItem) => {
    const id = Math.max(...shoppingList.map(i => i.id), 0) + 1;
    setShoppingList([...shoppingList, { ...newItem, id, checked: false }]);
    setShowAddShoppingModal(false);
  };

  // Recipe handlers
  const handleAddRecipe = (newRecipe) => {
    const id = Math.max(...recipes.map(r => r.id), 0) + 1;
    setRecipes([...recipes, { ...newRecipe, id }]);
    setShowAddRecipeModal(false);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
    setSelectedRecipe(null);
  };

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
                  pantryItems={pantryItems}
                  onBack={() => setSelectedRecipe(null)}
                  onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
                />
              ) : (
                <>
                  <div className="recipes-header">
                    <button className="add-recipe-btn" onClick={() => setShowAddRecipeModal(true)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Recipe
                    </button>
                  </div>

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
              <div className="pantry-actions-bar">
                <button className="add-pantry-btn" onClick={() => setShowAddPantryModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Item
                </button>
              </div>
              <div className="pantry-grid">
                {pantryItems.map((item) => (
                  <div
                    key={item.id}
                    className="pantry-item"
                    onClick={() => setEditingItem(item)}
                  >
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
                    className={`shopping-item-full ${item.checked ? 'checked' : ''}`}
                  >
                    <div
                      className={`checkbox ${item.checked ? 'checked' : ''}`}
                      onClick={() => handleToggleShoppingItem(item.id)}
                    />
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      className="delete-shopping-btn"
                      onClick={() => handleDeleteShoppingItem(item.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="shopping-footer">
                <span>
                  {shoppingList.filter((i) => !i.checked).length} items remaining
                </span>
                <button className="add-item-btn" onClick={() => setShowAddShoppingModal(true)}>
                  + Add Item
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Pantry Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <EditPantryItemModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={(newQty) => {
              handleUpdateQuantity(editingItem.id, newQty);
              setEditingItem(null);
            }}
            onDelete={() => {
              handleDeletePantryItem(editingItem.id);
              setEditingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Add Pantry Item Modal */}
      <AnimatePresence>
        {showAddPantryModal && (
          <AddPantryItemModal
            onClose={() => setShowAddPantryModal(false)}
            onAdd={handleAddPantryItem}
            categories={categories}
            emojis={commonEmojis}
          />
        )}
      </AnimatePresence>

      {/* Add Shopping Item Modal */}
      <AnimatePresence>
        {showAddShoppingModal && (
          <AddShoppingItemModal
            onClose={() => setShowAddShoppingModal(false)}
            onAdd={handleAddShoppingItem}
            emojis={commonEmojis}
          />
        )}
      </AnimatePresence>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddRecipeModal && (
          <AddRecipeModal
            onClose={() => setShowAddRecipeModal(false)}
            onAdd={handleAddRecipe}
            emojis={commonEmojis}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

// Edit Pantry Item Modal
function EditPantryItemModal({ item, onClose, onSave, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-icon">{item.icon}</span>
          <h3>{item.name}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="quantity-editor">
            <label>Quantity</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(q => Math.max(0, q - 1))}>−</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
              />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
              <span className="unit-label">{item.unit}</span>
            </div>
          </div>

          <div className="quick-adjust">
            <span>Quick adjust:</span>
            <button onClick={() => setQuantity(q => q + 5)}>+5</button>
            <button onClick={() => setQuantity(q => q + 10)}>+10</button>
            <button onClick={() => setQuantity(q => Math.max(0, q - 5))}>−5</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-btn" onClick={onDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
            </svg>
            Delete
          </button>
          <button className="save-btn" onClick={() => onSave(quantity)}>
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add Pantry Item Modal
function AddPantryItemModal({ onClose, onAdd, categories, emojis }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('pantry');
  const [icon, setIcon] = useState('📦');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity, unit, category, icon });
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
        className="modal-content modal-large"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add Pantry Item</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
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
              <label>Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eggs, Milk, Bread..."
                autoFocus
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="pcs">pcs</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="slices">slices</option>
                <option value="cloves">cloves</option>
                <option value="cobs">cobs</option>
                <option value="heads">heads</option>
                <option value="bunches">bunches</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={!name.trim()}>
              Add Item
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Add Shopping Item Modal
function AddShoppingItemModal({ onClose, onAdd, emojis }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [icon, setIcon] = useState('🛒');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity, unit, icon });
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
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add Shopping Item</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
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
              <label>Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What do you need to buy?"
                autoFocus
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="form-group flex-grow">
              <label>Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="pcs">pcs</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="bunch">bunch</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={!name.trim()}>
              Add to List
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Add Recipe Modal
function AddRecipeModal({ onClose, onAdd, emojis }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('15 min');
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState(2);
  const [icon, setIcon] = useState('🍳');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', amount: 1, unit: 'pcs' }]);
  const [steps, setSteps] = useState([{ instruction: '', tip: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'pcs' }]);
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
      ingredients: validIngredients.map(i => ({ ...i, amount: Number(i.amount) })),
      steps: validSteps,
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

        <form onSubmit={handleSubmit} className="modal-body recipe-form">
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

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={!name.trim()}>
              Create Recipe
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
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
