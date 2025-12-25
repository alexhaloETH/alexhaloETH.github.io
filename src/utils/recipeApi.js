import { getAuthHeaders, getAuthHeadersOnly } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

export const getAllRecipes = async () => {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    headers: getAuthHeadersOnly(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
};

export const getRecipe = async (id) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    headers: getAuthHeadersOnly(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
};

export const createRecipe = async (recipe) => {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }
  return response.json();
};

export const updateRecipe = async (id, recipe) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
};

export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeadersOnly(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
  return response.json();
};
