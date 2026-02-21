import { transformPantryItem, transformToBackendFormat } from './pantryMappings';
import { apiRequest, withErrorContext } from './apiClient';

export const getAllPantryItems = async () => withErrorContext(
  'Error fetching pantry items',
  async () => {
    const data = await apiRequest('/pantry');
    return data.map(transformPantryItem);
  },
);

export const getPantryItem = async (id) => withErrorContext(`Error fetching pantry item ${id}`, async () => {
  const data = await apiRequest(`/pantry/${id}`);
  return transformPantryItem(data);
});

export const createPantryItem = async (item) => withErrorContext('Error creating pantry item', () => {
  const backendItem = transformToBackendFormat(item);
  return apiRequest('/pantry', {
    method: 'POST',
    body: backendItem,
  });
});

export const deletePantryItem = async (id) => withErrorContext(`Error deleting pantry item ${id}`, () => (
  apiRequest(`/pantry/${id}`, {
    method: 'DELETE',
  })
));

export const updatePantryItem = async (id, updatedItem) => withErrorContext(
  `Error updating pantry item ${id}`,
  () => {
    const backendItem = transformToBackendFormat(updatedItem);
    return apiRequest(`/pantry/${id}`, {
      method: 'PUT',
      body: backendItem,
    });
  },
);
