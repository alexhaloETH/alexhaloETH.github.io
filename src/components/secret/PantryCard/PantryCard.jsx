import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  EditPantryItemModal,
  AddPantryItemModal,
  AddShoppingItemModal,
  AddRecipeModal,
  EditRecipeModal,
  RecipeCard,
  RecipeDetail,
} from './components';
import { useNotification } from '../../../contexts/NotificationContext';
import {
  getAllPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
} from '../../../utils/pantryApi';
import {
  getAllShoppingItems,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} from '../../../utils/shoppingApi';
import {
  getAllRecipes,
  createRecipe as createRecipeAPI,
  updateRecipe as updateRecipeAPI,
  deleteRecipe as deleteRecipeAPI,
} from '../../../utils/recipeApi';
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
const RECIPES_PER_PAGE = 50;

function PantryCard() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('recipes');
  const [selectedTag, setSelectedTag] = useState('all'); // Tag filter
  const [recipeSort, setRecipeSort] = useState('name'); // 'score', 'name'
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipePage, setRecipePage] = useState(0);
  const [pantryItems, setPantryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [editingItem, setEditingItem] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showAddPantryModal, setShowAddPantryModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showAddShoppingModal, setShowAddShoppingModal] = useState(false);

  // Fetch pantry, shopping items, and recipes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pantry, shopping, fetchedRecipes] = await Promise.all([
          getAllPantryItems(),
          getAllShoppingItems(),
          getAllRecipes(),
        ]);
        setPantryItems(pantry);
        setShoppingList(shopping);
        setRecipes(fetchedRecipes);
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to load items. Make sure the backend is running on localhost:8080',
          type: 'error',
        });
        console.error('Failed to fetch items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showNotification]);

  // Get all unique tags from recipes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      if (recipe.tags && Array.isArray(recipe.tags)) {
        recipe.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = recipes.filter((recipe) =>
        recipe.tags && recipe.tags.includes(selectedTag)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (recipeSort === 'score') {
        const scoreA = a.alex_score || 0;
        const scoreB = b.alex_score || 0;
        return scoreB - scoreA;
      } else {
        // Default 'name' sort
        return a.name.localeCompare(b.name);
      }
    });
  }, [recipes, selectedTag, recipeSort]);

  const totalRecipes = filteredAndSortedRecipes.length;
  const totalPages = Math.max(1, Math.ceil(totalRecipes / RECIPES_PER_PAGE));
  const pageStart = recipePage * RECIPES_PER_PAGE;
  const pageEnd = Math.min(pageStart + RECIPES_PER_PAGE, totalRecipes);
  const pagedRecipes = filteredAndSortedRecipes.slice(pageStart, pageEnd);

  useEffect(() => {
    setRecipePage(0);
  }, [selectedTag, recipeSort, recipes.length]);

  useEffect(() => {
    if (recipePage > totalPages - 1) {
      setRecipePage(Math.max(totalPages - 1, 0));
    }
  }, [recipePage, totalPages]);


  // Pantry item handlers
  const handleUpdateQuantity = async (id, newQuantity, newStatus) => {
    const item = pantryItems.find(i => i.id === id);
    if (!item) return;

    const updatedItem = {
      ...item,
      quantity: Math.max(0, newQuantity),
      status: newStatus || item.status || 'green'
    };

    // Optimistic update
    setPantryItems(items =>
      items.map(i => i.id === id ? updatedItem : i)
    );

    try {
      await updatePantryItem(id, updatedItem);
      showNotification({
        title: 'Success',
        message: 'Pantry item updated',
        type: 'success',
      });
    } catch (error) {
      // Revert on error
      setPantryItems(items =>
        items.map(i => i.id === id ? item : i)
      );
      showNotification({
        title: 'Error',
        message: 'Failed to update pantry item',
        type: 'error',
      });
    }
  };

  const handleDeletePantryItem = async (id) => {
    const itemToDelete = pantryItems.find(i => i.id === id);

    // Optimistic delete
    setPantryItems(items => items.filter(item => item.id !== id));

    try {
      await deletePantryItem(id);
      showNotification({
        title: 'Success',
        message: 'Pantry item deleted',
        type: 'success',
      });
    } catch (error) {
      // Revert on error
      if (itemToDelete) {
        setPantryItems(items => [...items, itemToDelete]);
      }
      showNotification({
        title: 'Error',
        message: 'Failed to delete pantry item',
        type: 'error',
      });
    }
  };

  const handleAddPantryItem = async (newItem) => {
    try {
      await createPantryItem(newItem);
      // Refetch all items to get the server-generated ID
      const items = await getAllPantryItems();
      setPantryItems(items);
      setShowAddPantryModal(false);
      showNotification({
        title: 'Success',
        message: 'Pantry item added',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to add pantry item',
        type: 'error',
      });
    }
  };

  // Shopping list handlers
  const handleToggleShoppingItem = async (id) => {
    const item = shoppingList.find(i => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, checked: !item.checked };

    // Optimistic update
    setShoppingList(items =>
      items.map(i => i.id === id ? updatedItem : i)
    );

    try {
      await updateShoppingItem(id, updatedItem);
    } catch (error) {
      // Revert on error
      setShoppingList(items =>
        items.map(i => i.id === id ? item : i)
      );
      showNotification({
        title: 'Error',
        message: 'Failed to update shopping item',
        type: 'error',
      });
    }
  };

  const handleDeleteShoppingItem = async (id) => {
    const itemToDelete = shoppingList.find(i => i.id === id);

    // Optimistic delete
    setShoppingList(items => items.filter(item => item.id !== id));

    try {
      await deleteShoppingItem(id);
      showNotification({
        title: 'Success',
        message: 'Shopping item deleted',
        type: 'success',
      });
    } catch (error) {
      // Revert on error
      if (itemToDelete) {
        setShoppingList(items => [...items, itemToDelete]);
      }
      showNotification({
        title: 'Error',
        message: 'Failed to delete shopping item',
        type: 'error',
      });
    }
  };

  const handleAddShoppingItem = async (newItem) => {
    try {
      await createShoppingItem({ ...newItem, checked: false });
      // Refetch all items to get the server-generated ID
      const items = await getAllShoppingItems();
      setShoppingList(items);
      setShowAddShoppingModal(false);
      showNotification({
        title: 'Success',
        message: 'Shopping item added',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to add shopping item',
        type: 'error',
      });
    }
  };

  // Recipe handlers
  const handleAddRecipe = async (newRecipe) => {
    try {
      await createRecipeAPI(newRecipe);
      // Refetch all recipes
      const fetchedRecipes = await getAllRecipes();
      setRecipes(fetchedRecipes);
      setShowAddRecipeModal(false);
      showNotification({
        title: 'Success',
        message: 'Recipe added',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to add recipe',
        type: 'error',
      });
    }
  };

  const handleUpdateRecipe = async (updatedRecipe) => {
    try {
      await updateRecipeAPI(selectedRecipe.id, updatedRecipe);
      const refreshedRecipes = await getAllRecipes();
      setRecipes(refreshedRecipes);
      const updated = refreshedRecipes.find(r => r.id === selectedRecipe.id);
      setSelectedRecipe(updated);
      setEditingRecipe(null);
      showNotification({
        title: 'Success',
        message: 'Recipe updated',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update recipe',
        type: 'error',
      });
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await deleteRecipeAPI(id);
      setRecipes(recipes.filter(r => r.id !== id));
      setSelectedRecipe(null);
      showNotification({
        title: 'Success',
        message: 'Recipe deleted',
        type: 'success',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to delete recipe',
        type: 'error',
      });
    }
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
              {recipes.length} recipes total
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
                  onEdit={() => setEditingRecipe(selectedRecipe)}
                  onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
                />
              ) : (
                <>
                  <div className="recipes-header">
                    <div className="recipe-filters">
                      <select
                        className="tag-filter-select"
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
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
                        onChange={(e) => setRecipeSort(e.target.value)}
                      >
                        <option value="name">Sort by Name</option>
                        <option value="score">Sort by Alex Score</option>
                      </select>
                      <button className="add-recipe-btn" onClick={() => setShowAddRecipeModal(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Recipe
                      </button>
                    </div>
                  </div>

                  <div className="recipe-pagination">
                    <span className="recipe-count">
                      {totalRecipes === 0
                        ? 'No recipes found'
                        : `Showing ${pageStart + 1}-${pageEnd} of ${totalRecipes}`}
                    </span>
                    <div className="recipe-page-controls">
                      <button
                        className="page-btn"
                        onClick={() => setRecipePage((prev) => Math.max(prev - 1, 0))}
                        disabled={recipePage === 0}
                      >
                        Prev
                      </button>
                      <span className="page-indicator">
                        {totalPages === 0 ? 0 : recipePage + 1} / {totalPages}
                      </span>
                      <button
                        className="page-btn"
                        onClick={() => setRecipePage((prev) => Math.min(prev + 1, totalPages - 1))}
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
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
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
                      className={`item-status ${item.status || 'green'}`}
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
            onSave={(newQty, newStatus) => {
              handleUpdateQuantity(editingItem.id, newQty, newStatus);
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
            existingRecipes={recipes}
          />
        )}
      </AnimatePresence>

      {/* Edit Recipe Modal */}
      <AnimatePresence>
        {editingRecipe && (
          <EditRecipeModal
            recipe={editingRecipe}
            onClose={() => setEditingRecipe(null)}
            onUpdate={handleUpdateRecipe}
            emojis={commonEmojis}
            existingRecipes={recipes}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default PantryCard;
