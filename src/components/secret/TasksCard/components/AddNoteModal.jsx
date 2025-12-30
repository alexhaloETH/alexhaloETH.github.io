import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from './ImageUpload';

const colorOptions = [
  { value: '#10b981', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
];

function AddNoteModal({ onClose, onAdd, isIdea = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#10b981');
  const [pinned, setPinned] = useState(false);
  const [images, setImages] = useState([]);

  const handleImageSelect = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setImages([...images, ...fileArray]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd({
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
      images,
    });
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content add-note-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add New {isIdea ? 'Idea' : 'Note'}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isIdea ? "What's the idea?" : "Note title"}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isIdea ? "Describe your idea..." : "Write your note..."}
              rows={6}
              style={{
                background: 'rgb(255 255 255 / 3%)',
                border: '1px solid rgb(255 255 255 / 10%)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                padding: '12px 14px',
                resize: 'vertical',
                width: '100%',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgb(16 185 129 / 50%)'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(255 255 255 / 10%)'}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c.value,
                    border: color === c.value ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: color === c.value ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Pin this {isIdea ? 'idea' : 'note'}</span>
            </label>
          </div>

          <div className="form-group">
            <label>Images</label>
            <ImageUpload onImageSelect={handleImageSelect} multiple />
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                    <button
                      className="image-preview-remove"
                      onClick={() => handleRemoveImage(index)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button
              className="btn-save"
              onClick={handleAdd}
              disabled={!title.trim() || !content.trim()}
            >
              Add {isIdea ? 'Idea' : 'Note'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddNoteModal;
