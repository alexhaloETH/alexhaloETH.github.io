import React, { useState, useEffect } from 'react';
import { getEntityImages, getImageUrl, deleteImage } from '../../../../utils/imagesApi';
import './ImageGallery.css';

const ImageGallery = ({ entityType, entityId, editable = false, onImageDelete }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, [entityType, entityId]);

  const loadImages = async () => {
    try {
      const fetchedImages = await getEntityImages(entityType, entityId);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (onImageDelete) {
        onImageDelete(imageId);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) return null;
  if (images.length === 0) return null;

  return (
    <div className="image-gallery">
      {images.map((image) => (
        <div key={image.id} className="image-gallery-item">
          <img src={getImageUrl(image.filepath)} alt={image.filename} />
          {editable && (
            <button
              className="image-gallery-delete"
              onClick={() => handleDelete(image.id)}
              title="Delete image"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
