import { apiRequest, withErrorContext } from './apiClient';

export const getAllRecipes = async () => withErrorContext('Failed to fetch recipes', () => (
  apiRequest('/recipes')
));

export const getRecipe = async (id) => withErrorContext(`Failed to fetch recipe ${id}`, () => (
  apiRequest(`/recipes/${id}`)
));

export const createRecipe = async (recipe) => withErrorContext('Failed to create recipe', () => (
  apiRequest('/recipes', {
    method: 'POST',
    body: recipe,
  })
));

export const updateRecipe = async (id, recipe) => withErrorContext(`Failed to update recipe ${id}`, () => (
  apiRequest(`/recipes/${id}`, {
    method: 'PUT',
    body: recipe,
  })
));

export const deleteRecipe = async (id) => withErrorContext(`Failed to delete recipe ${id}`, () => (
  apiRequest(`/recipes/${id}`, {
    method: 'DELETE',
  })
));
