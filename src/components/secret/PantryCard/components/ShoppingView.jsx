function ShoppingView({
  shoppingList,
  onToggleItem,
  onDeleteItem,
  onShowAddItem,
}) {
  const remainingCount = shoppingList.filter((i) => !i.checked).length;

  return (
    <>
      <div className="shopping-list-full">
        {shoppingList.map((item) => (
          <div
            key={item.id}
            className={`shopping-item-full ${item.checked ? 'checked' : ''}`}
          >
            <div
              className={`checkbox ${item.checked ? 'checked' : ''}`}
              onClick={() => onToggleItem(item.id)}
            />
            <span className="item-icon">{item.icon}</span>
            <span className="item-name">{item.name}</span>
            <span className="item-qty">
              {item.quantity} {item.unit}
            </span>
            <button
              className="delete-shopping-btn"
              onClick={() => onDeleteItem(item.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="shopping-footer">
        <span>
          {remainingCount} items remaining
        </span>
        <button className="add-item-btn" onClick={onShowAddItem}>
          + Add Item
        </button>
      </div>
    </>
  );
}

export default ShoppingView;
