import { transformPantryItem, transformToBackendFormat } from './pantryMappings';
import { getAuthHeaders, getAuthHeadersOnly } from './auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Get all pantry items
export const getAllPantryItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pantry`, {
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformPantryItem);
  } catch (error) {
    console.error('Error fetching pantry items:', error);
    throw error;
  }
};

// Get a single pantry item
export const getPantryItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pantry/${id}`, {
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return transformPantryItem(data);
  } catch (error) {
    console.error(`Error fetching pantry item ${id}:`, error);
    throw error;
  }
};

// Create a new pantry item
export const createPantryItem = async (item) => {
  try {
    const backendItem = transformToBackendFormat(item);
    console.log('Creating pantry item:', { original: item, transformed: backendItem });

    const response = await fetch(`${API_BASE_URL}/pantry`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendItem),
    });

    console.log('Create response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Create response data:', data);
    return data;
  } catch (error) {
    console.error('Error creating pantry item:', error);
    throw error;
  }
};

// Delete a pantry item
export const deletePantryItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pantry/${id}`, {
      method: 'DELETE',
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting pantry item ${id}:`, error);
    throw error;
  }
};

// Update a pantry item
export const updatePantryItem = async (id, updatedItem) => {
  try {
    const backendItem = transformToBackendFormat(updatedItem);
    const response = await fetch(`${API_BASE_URL}/pantry/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendItem),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating pantry item ${id}:`, error);
    throw error;
  }
};
