import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';
import ImageUpload from './ImageUpload';
import { COLOR_OPTIONS } from './NoteModal.constants';
import useNoteForm from './useNoteForm';

function NoteFormModal({
  note,
  isIdea,
  onClose,
  onSubmit,
  onDelete,
  submitLabel,
  titleLabel,
  showExistingImages = false,
}) {
  const {
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
  } = useNoteForm({ note });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    if (note) {
      onSubmit({
        ...note,
        title: title.trim(),
        content: content.trim(),
        color,
        pinned,
        images: newImages,
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      color,
      pinned,
      images: newImages,
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
        className={`modal-content ${note ? 'edit-note-modal' : 'add-note-modal'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{titleLabel}</h3>
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
              placeholder={isIdea ? 'Describe your idea...' : 'Write your note...'}
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
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: option.value,
                    border: color === option.value ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: color === option.value ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
                  }}
                  title={option.label}
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

          {showExistingImages && note && (
            <div className="form-group">
              <label>Existing Images</label>
              <ImageGallery
                entityType={isIdea ? 'idea' : 'note'}
                entityId={note.id}
                editable={true}
                key={refreshGallery}
                onImageDelete={bumpGallery}
              />
            </div>
          )}

          <div className="form-group">
            <label>{showExistingImages ? 'Add New Images' : 'Images'}</label>
            <ImageUpload onImageSelect={handleImageSelect} multiple />
            {newImages.length > 0 && (
              <div className="image-preview-grid">
                {newImages.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                    <button
                      className="image-preview-remove"
                      onClick={() => handleRemoveNewImage(index)}
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
          {onDelete && note && (
            <button className="btn-delete" onClick={() => { onDelete(note.id); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
              </svg>
              Delete
            </button>
          )}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NoteFormModal;
