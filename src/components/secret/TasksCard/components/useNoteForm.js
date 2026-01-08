import { useState } from 'react';

const useNoteForm = ({ note }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || '#10b981');
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [newImages, setNewImages] = useState([]);
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleImageSelect = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setNewImages([...newImages, ...fileArray]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const bumpGallery = () => setRefreshGallery((prev) => prev + 1);

  return {
    title,
    setTitle,
    content,
    setContent,
    color,
    setColor,
    pinned,
    setPinned,
    newImages,
    refreshGallery,
    handleImageSelect,
    handleRemoveNewImage,
    bumpGallery,
  };
};

export default useNoteForm;
