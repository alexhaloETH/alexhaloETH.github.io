function PantryView({ pantryItems, onShowAddItem, onEditItem, canEdit }) {
  return (
    <>
      {canEdit && (
        <div className="pantry-actions-bar">
          <button className="add-pantry-btn" onClick={onShowAddItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </button>
        </div>
      )}
      <div className="pantry-grid">
        {pantryItems.map((item) => (
          <div
            key={item.id}
            className="pantry-item"
            onClick={() => canEdit && onEditItem(item)}
          >
            <span className="item-icon">{item.icon}</span>
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">
                {item.quantity} {item.unit}
              </span>
            </div>
            <div
              className={`item-status ${item.status || 'green'}`}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default PantryView;
