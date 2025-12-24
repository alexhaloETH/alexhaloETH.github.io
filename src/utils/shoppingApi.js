import { transformPantryItem, transformToBackendFormat } from './pantryMappings';

const API_BASE_URL = 'http://localhost:8080/api';

// Transform shopping item from backend to frontend
const transformShoppingItem = (backendItem) => {
  const baseItem = transformPantryItem(backendItem);
  return {
    ...baseItem,
    checked: backendItem.state, // state maps to checked
  };
};

// Transform shopping item from frontend to backend
const transformToBackendShoppingFormat = (frontendItem) => {
  const baseBackend = transformToBackendFormat(frontendItem);
  const result = {
    ...baseBackend,
    state: frontendItem.checked || false, // checked maps to state
  };
  console.log('Transform shopping to backend:', { frontendItem, result });
  return result;
};

// Get all shopping items
export const getAllShoppingItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformShoppingItem);
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    throw error;
  }
};

// Get a single shopping item
export const getShoppingItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return transformShoppingItem(data);
  } catch (error) {
    console.error(`Error fetching shopping item ${id}:`, error);
    throw error;
  }
};

// Create a new shopping item
export const createShoppingItem = async (item) => {
  try {
    const backendItem = transformToBackendShoppingFormat(item);
    console.log('Creating shopping item:', { original: item, transformed: backendItem });

    const response = await fetch(`${API_BASE_URL}/shopping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendItem),
    });

    console.log('Create shopping response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Create shopping response data:', data);
    return data;
  } catch (error) {
    console.error('Error creating shopping item:', error);
    throw error;
  }
};

// Update a shopping item
export const updateShoppingItem = async (id, updatedItem) => {
  try {
    const backendItem = transformToBackendShoppingFormat(updatedItem);
    const response = await fetch(`${API_BASE_URL}/shopping/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendItem),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating shopping item ${id}:`, error);
    throw error;
  }
};

// Delete a shopping item
export const deleteShoppingItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting shopping item ${id}:`, error);
    throw error;
  }
};
