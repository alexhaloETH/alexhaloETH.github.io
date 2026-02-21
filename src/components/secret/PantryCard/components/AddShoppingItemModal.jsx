import ItemFormModal from './ItemFormModal';

const SHOPPING_UNITS = ['pcs', 'g', 'ml', 'kg', 'L', 'bunch'];

function AddShoppingItemModal({ onClose, onAdd, emojis }) {
  return (
    <ItemFormModal
      title="Add Shopping Item"
      submitLabel="Add to List"
      itemPlaceholder="What do you need to buy?"
      onClose={onClose}
      onSubmit={onAdd}
      emojis={emojis}
      defaultIcon="🛒"
      defaultQuantity={1}
      defaultUnit="pcs"
      minQuantity={1}
      units={SHOPPING_UNITS}
    />
  );
}

export default AddShoppingItemModal;
