import ItemFormModal from './ItemFormModal';

const PANTRY_UNITS = ['pcs', 'g', 'ml', 'kg', 'L', 'slices', 'cloves', 'cobs', 'heads', 'bunches'];

function AddPantryItemModal({ onClose, onAdd, categories, emojis }) {
  return (
    <ItemFormModal
      title="Add Pantry Item"
      submitLabel="Add Item"
      itemPlaceholder="e.g. Eggs, Milk, Bread..."
      onClose={onClose}
      onSubmit={onAdd}
      emojis={emojis}
      defaultIcon="📦"
      defaultQuantity={1}
      defaultUnit="pcs"
      minQuantity={0}
      units={PANTRY_UNITS}
      modalSizeClass="modal-large"
      categoryOptions={categories}
      defaultCategory="pantry"
    />
  );
}

export default AddPantryItemModal;
