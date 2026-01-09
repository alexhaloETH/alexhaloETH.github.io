import { useEffect, useMemo, useState } from 'react';
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
import { RECIPES_PER_PAGE } from './PantryCard.constants';

const normalizeSearchValue = (value = '') => (
  value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
);

const splitIngredientSearch = (value = '') => {
  const normalized = value
    .replace(/\s+and\s+/gi, ',')
    .replace(/[+|]/g, ',');

  return normalized
    .split(/[,;\n]+/)
    .map((token) => normalizeSearchValue(token))
    .filter(Boolean);
};

const matchesIngredientToken = (ingredient, token) => {
  if (!ingredient || !token) return false;
  if (ingredient.includes(token) || token.includes(ingredient)) return true;
  if (token.endsWith('s') && token.length > 3) {
    const singular = token.slice(0, -1);
    return ingredient.includes(singular);
  }
  return false;
};

const usePantryData = (showNotification) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [selectedTag, setSelectedTag] = useState('all');
  const [recipeSort, setRecipeSort] = useState('name');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipePage, setRecipePage] = useState(0);
  const [pantryItems, setPantryItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeSearchMode, setRecipeSearchMode] = useState('name');
  const [showRecipeSearch, setShowRecipeSearch] = useState(false);
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

    const normalizedSearch = normalizeSearchValue(recipeSearch);

    if (normalizedSearch) {
      if (recipeSearchMode === 'ingredients') {
        const searchTokens = splitIngredientSearch(recipeSearch);
        if (searchTokens.length > 0) {
          filtered = filtered.filter((recipe) => {
            const ingredientNames = (recipe.ingredients || [])
              .map((ingredient) => normalizeSearchValue(ingredient?.name || ''))
              .filter(Boolean);

            return searchTokens.every((token) =>
              ingredientNames.some((ingredient) =>
                matchesIngredientToken(ingredient, token)
              )
            );
          });
        }
      } else {
        filtered = filtered.filter((recipe) =>
          normalizeSearchValue(recipe.name).includes(normalizedSearch)
        );
      }
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (recipeSort === 'score') {
        const scoreA = a.alex_score || 0;
        const scoreB = b.alex_score || 0;
        return scoreB - scoreA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [recipes, selectedTag, recipeSort, recipeSearch, recipeSearchMode]);

  const totalRecipes = filteredAndSortedRecipes.length;
  const totalPages = Math.max(1, Math.ceil(totalRecipes / RECIPES_PER_PAGE));
  const pageStart = recipePage * RECIPES_PER_PAGE;
  const pageEnd = Math.min(pageStart + RECIPES_PER_PAGE, totalRecipes);
  const pagedRecipes = filteredAndSortedRecipes.slice(pageStart, pageEnd);

  useEffect(() => {
    setRecipePage(0);
  }, [selectedTag, recipeSort, recipeSearch, recipeSearchMode, recipes.length]);

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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      showNotification({
        title: 'Error',
        message: 'Failed to delete recipe',
        type: 'error',
      });
    }
  };

  return {
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
    filteredAndSortedRecipes,
    pagedRecipes,
    totalRecipes,
    totalPages,
    pageStart,
    pageEnd,
    isLoading,
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
  };
};

export default usePantryData;
