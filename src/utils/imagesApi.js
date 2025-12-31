import { getAuthHeaders, getAuthHeadersOnly } from './auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Upload an image (base64 encoded)
export const uploadImage = async (entityType, entityId, file) => {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
        filename: file.name,
        data: base64Data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all images for an entity
export const getEntityImages = async (entityType, entityId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/${entityType}/${entityId}`,
      {
        headers: getAuthHeadersOnly(),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Delete an image
export const deleteImage = async (imageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
      method: 'DELETE',
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
};

// Get image URL for serving
export const getImageUrl = (filepath) => {
  // Extract filename from filepath (removes ./uploads/ prefix)
  const filename = filepath.split('/').pop();
  return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data:image/...;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
