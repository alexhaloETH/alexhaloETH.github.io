import { useEffect, useMemo } from 'react';
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
import { useAuth } from '../../../contexts/AuthContext';
import { COMMON_EMOJIS, PANTRY_CATEGORIES, PANTRY_TABS } from './PantryCard.constants';
import usePantryData from './usePantryData';
import './PantryCard.css';

function PantryCard() {
  const { showNotification } = useNotification();
  const { canRead, canWrite } = useAuth();
  const canReadRecipes = canRead('recipes');
  const canReadPantry = canRead('pantry');
  const canReadShopping = canRead('shopping');
  const canWriteRecipes = canWrite('recipes');
  const canWritePantry = canWrite('pantry');
  const canWriteShopping = canWrite('shopping');
  const visibleTabs = useMemo(
    () => PANTRY_TABS.filter((tab) => canRead(tab.resource)),
    [canRead],
  );
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
  } = usePantryData(showNotification, {
    canReadPantry,
    canReadShopping,
    canReadRecipes,
    canWritePantry,
    canWriteShopping,
    canWriteRecipes,
  });

  const isSearchOpen = showRecipeSearch && activeTab === 'recipes';

  const handleFindRecipe = () => {
    if (!canReadRecipes) {
      return;
    }

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

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [activeTab, setActiveTab, visibleTabs]);

  if (visibleTabs.length === 0) {
    return null;
  }

  return (
    <BaseCard className="card secret-card pantry-card wide">
      <PantryHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recipeCount={recipes.length}
        onFindRecipe={handleFindRecipe}
        isSearchOpen={isSearchOpen}
        tabs={visibleTabs}
      />

      <div className="pantry-content">
        <AnimatePresence mode="wait">
          {activeTab === 'recipes' && canReadRecipes && (
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
                onEdit={canWriteRecipes ? () => setEditingRecipe(selectedRecipe) : null}
                onDelete={canWriteRecipes ? () => handleDeleteRecipe(selectedRecipe.id) : null}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
                allTags={allTags}
                recipes={recipes}
                recipeSort={recipeSort}
                onSortChange={setRecipeSort}
                onShowAddRecipe={canWriteRecipes ? () => setShowAddRecipeModal(true) : null}
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
                canEdit={canWriteRecipes}
              />
            </motion.div>
          )}

          {activeTab === 'pantry' && canReadPantry && (
            <motion.div
              key="pantry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pantry-view"
            >
              <PantryView
                pantryItems={pantryItems}
                onShowAddItem={canWritePantry ? () => setShowAddPantryModal(true) : null}
                onEditItem={canWritePantry ? setEditingItem : null}
                canEdit={canWritePantry}
              />
            </motion.div>
          )}

          {activeTab === 'shopping' && canReadShopping && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="shopping-view"
            >
              <ShoppingView
                shoppingList={shoppingList}
                onToggleItem={canWriteShopping ? handleToggleShoppingItem : null}
                onDeleteItem={canWriteShopping ? handleDeleteShoppingItem : null}
                onShowAddItem={canWriteShopping ? () => setShowAddShoppingModal(true) : null}
                canEdit={canWriteShopping}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Pantry Item Modal */}
      <AnimatePresence>
        {editingItem && canWritePantry && (
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
        {showAddPantryModal && canWritePantry && (
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
        {showAddShoppingModal && canWriteShopping && (
          <AddShoppingItemModal
            onClose={() => setShowAddShoppingModal(false)}
            onAdd={handleAddShoppingItem}
            emojis={COMMON_EMOJIS}
          />
        )}
      </AnimatePresence>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddRecipeModal && canWriteRecipes && (
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
        {editingRecipe && canWriteRecipes && (
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
