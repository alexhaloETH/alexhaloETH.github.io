import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  pantryItems as initialPantryItems,
  shoppingList as initialShoppingList,
  recipes as initialRecipes,
  canMakeRecipe,
} from '../../../data/secret/pantry';
import {
  EditPantryItemModal,
  AddPantryItemModal,
  AddShoppingItemModal,
  AddRecipeModal,
  RecipeCard,
  RecipeDetail,
} from './components';
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

export default PantryCard;
