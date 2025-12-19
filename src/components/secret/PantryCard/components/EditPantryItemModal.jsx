import { useState } from 'react';
import { motion } from 'framer-motion';

function EditPantryItemModal({ item, onClose, onSave, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-icon">{item.icon}</span>
          <h3>{item.name}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="quantity-editor">
            <label>Quantity</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(q => Math.max(0, q - 1))}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
              />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
              <span className="unit-label">{item.unit}</span>
            </div>
          </div>

          <div className="quick-adjust">
            <span>Quick adjust:</span>
            <button onClick={() => setQuantity(q => q + 5)}>+5</button>
            <button onClick={() => setQuantity(q => q + 10)}>+10</button>
            <button onClick={() => setQuantity(q => Math.max(0, q - 5))}>-5</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-btn" onClick={onDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
            </svg>
            Delete
          </button>
          <button className="save-btn" onClick={() => onSave(quantity)}>
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EditPantryItemModal;
