import { motion, AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import {
  AddPantryItemModal,
  AddRecipeModal,
  AddShoppingItemModal,
  EditPantryItemModal,
  EditRecipeModal,
  PantryHeader,
  PantryView,
  RecipesView,
  ShoppingView,
} from './components';
import { useNotification } from '../../../contexts/NotificationContext';
import { COMMON_EMOJIS, PANTRY_CATEGORIES } from './PantryCard.constants';
import usePantryData from './usePantryData';
import './PantryCard.css';

function PantryCard() {
  const { showNotification } = useNotification();
  const {
    activeTab,
    setActiveTab,
    selectedTag,
    setSelectedTag,
    recipeSort,
    setRecipeSort,
    selectedRecipe,
    setSelectedRecipe,
    recipePage,
    setRecipePage,
    pantryItems,
    shoppingList,
    recipes,
    recipeSearch,
    setRecipeSearch,
    recipeSearchMode,
    setRecipeSearchMode,
    showRecipeSearch,
    setShowRecipeSearch,
    allTags,
    pagedRecipes,
    totalRecipes,
    totalPages,
    pageStart,
    pageEnd,
    editingItem,
    setEditingItem,
    editingRecipe,
    setEditingRecipe,
    showAddPantryModal,
    setShowAddPantryModal,
    showAddRecipeModal,
    setShowAddRecipeModal,
    showAddShoppingModal,
    setShowAddShoppingModal,
    handleUpdateQuantity,
    handleDeletePantryItem,
    handleAddPantryItem,
    handleToggleShoppingItem,
    handleDeleteShoppingItem,
    handleAddShoppingItem,
    handleAddRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
  } = usePantryData(showNotification);

  const isSearchOpen = showRecipeSearch && activeTab === 'recipes';

  const handleFindRecipe = () => {
    if (activeTab !== 'recipes') {
      setActiveTab('recipes');
      setShowRecipeSearch(true);
      return;
    }

    setShowRecipeSearch((prev) => {
      if (prev) {
        setRecipeSearch('');
      }
      return !prev;
    });
  };

  return (
    <BaseCard className="card secret-card pantry-card wide">
      <PantryHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recipeCount={recipes.length}
        onFindRecipe={handleFindRecipe}
        isSearchOpen={isSearchOpen}
      />

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
              <RecipesView
                selectedRecipe={selectedRecipe}
                pantryItems={pantryItems}
                onBack={() => setSelectedRecipe(null)}
                onEdit={() => setEditingRecipe(selectedRecipe)}
                onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
                allTags={allTags}
                recipes={recipes}
                recipeSort={recipeSort}
                onSortChange={setRecipeSort}
                onShowAddRecipe={() => setShowAddRecipeModal(true)}
                totalRecipes={totalRecipes}
                pageStart={pageStart}
                pageEnd={pageEnd}
                recipePage={recipePage}
                totalPages={totalPages}
                onPageChange={setRecipePage}
                pagedRecipes={pagedRecipes}
                onSelectRecipe={setSelectedRecipe}
                recipeSearch={recipeSearch}
                onRecipeSearchChange={setRecipeSearch}
                recipeSearchMode={recipeSearchMode}
                onRecipeSearchModeChange={setRecipeSearchMode}
                showRecipeSearch={showRecipeSearch}
              />
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
              <PantryView
                pantryItems={pantryItems}
                onShowAddItem={() => setShowAddPantryModal(true)}
                onEditItem={setEditingItem}
              />
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
              <ShoppingView
                shoppingList={shoppingList}
                onToggleItem={handleToggleShoppingItem}
                onDeleteItem={handleDeleteShoppingItem}
                onShowAddItem={() => setShowAddShoppingModal(true)}
              />
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
            categories={PANTRY_CATEGORIES}
            emojis={COMMON_EMOJIS}
          />
        )}
      </AnimatePresence>

      {/* Add Shopping Item Modal */}
      <AnimatePresence>
        {showAddShoppingModal && (
          <AddShoppingItemModal
            onClose={() => setShowAddShoppingModal(false)}
            onAdd={handleAddShoppingItem}
            emojis={COMMON_EMOJIS}
          />
        )}
      </AnimatePresence>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddRecipeModal && (
          <AddRecipeModal
            onClose={() => setShowAddRecipeModal(false)}
            onAdd={handleAddRecipe}
            emojis={COMMON_EMOJIS}
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
            emojis={COMMON_EMOJIS}
            existingRecipes={recipes}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default PantryCard;
