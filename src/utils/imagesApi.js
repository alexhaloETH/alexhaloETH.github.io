import { API_ROOT, apiRequest, withErrorContext } from './apiClient';

export const uploadImage = async (entityType, entityId, file) => withErrorContext(
  'Error uploading image',
  async () => {
    const base64Data = await fileToBase64(file);

    return apiRequest('/images/upload', {
      method: 'POST',
      body: {
        entity_type: entityType,
        entity_id: entityId,
        filename: file.name,
        data: base64Data,
      },
    });
  },
);

export const getEntityImages = async (entityType, entityId) => withErrorContext(
  'Error fetching images',
  () => apiRequest(`/images/${entityType}/${entityId}`),
);

export const deleteImage = async (imageId) => withErrorContext(`Error deleting image ${imageId}`, () => (
  apiRequest(`/images/${imageId}`, {
    method: 'DELETE',
  })
));

export const getImageUrl = (filepath) => {
  const filename = filepath.split('/').pop();
  return `${API_ROOT}/uploads/${filename}`;
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64 = reader.result.split(',')[1];
    resolve(base64);
  };
  reader.onerror = (error) => reject(error);
});
