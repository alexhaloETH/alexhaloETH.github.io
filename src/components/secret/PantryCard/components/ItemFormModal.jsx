import { useState } from 'react';
import { motion } from 'framer-motion';

function ItemFormModal({
  title,
  submitLabel,
  itemPlaceholder,
  onClose,
  onSubmit,
  emojis,
  defaultIcon,
  defaultQuantity = 1,
  defaultUnit = 'pcs',
  minQuantity = 0,
  units = [],
  modalSizeClass = '',
  categoryOptions,
  defaultCategory,
}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [unit, setUnit] = useState(defaultUnit);
  const [icon, setIcon] = useState(defaultIcon);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [category, setCategory] = useState(defaultCategory || categoryOptions?.[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      quantity,
      unit,
      icon,
    };

    if (categoryOptions?.length) {
      payload.category = category;
      payload.status = 'green';
    }

    onSubmit(payload);
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
        className={`modal-content ${modalSizeClass}`.trim()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group icon-picker-group">
              <label>Icon</label>
              <button
                type="button"
                className="icon-picker-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {icon}
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={emoji === icon ? 'selected' : ''}
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group flex-grow">
              <label>Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={itemPlaceholder}
                autoFocus
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={minQuantity}
              />
            </div>

            <div className={`form-group ${categoryOptions?.length ? '' : 'flex-grow'}`.trim()}>
              <label>Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                {units.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {categoryOptions?.length > 0 && (
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={!name.trim()}>
              {submitLabel}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ItemFormModal;
