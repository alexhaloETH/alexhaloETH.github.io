import { transformPantryItem, transformToBackendFormat } from './pantryMappings';
import { apiRequest, withErrorContext } from './apiClient';

const transformShoppingItem = (backendItem) => {
  const baseItem = transformPantryItem(backendItem);
  return {
    ...baseItem,
    checked: backendItem.state,
  };
};

const transformToBackendShoppingFormat = (frontendItem) => ({
  ...transformToBackendFormat(frontendItem),
  state: frontendItem.checked || false,
});

export const getAllShoppingItems = async () => withErrorContext(
  'Error fetching shopping items',
  async () => {
    const data = await apiRequest('/shopping');
    return data.map(transformShoppingItem);
  },
);

export const getShoppingItem = async (id) => withErrorContext(
  `Error fetching shopping item ${id}`,
  async () => {
    const data = await apiRequest(`/shopping/${id}`);
    return transformShoppingItem(data);
  },
);

export const createShoppingItem = async (item) => withErrorContext('Error creating shopping item', () => {
  const backendItem = transformToBackendShoppingFormat(item);
  return apiRequest('/shopping', {
    method: 'POST',
    body: backendItem,
  });
});

export const updateShoppingItem = async (id, updatedItem) => withErrorContext(
  `Error updating shopping item ${id}`,
  () => {
    const backendItem = transformToBackendShoppingFormat(updatedItem);
    return apiRequest(`/shopping/${id}`, {
      method: 'PUT',
      body: backendItem,
    });
  },
);

export const deleteShoppingItem = async (id) => withErrorContext(`Error deleting shopping item ${id}`, () => (
  apiRequest(`/shopping/${id}`, {
    method: 'DELETE',
  })
));
