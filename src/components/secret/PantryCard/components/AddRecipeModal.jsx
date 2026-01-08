import RecipeFormModal from './RecipeFormModal';

function AddRecipeModal({ onClose, onAdd, emojis, existingRecipes = [] }) {
  return (
    <RecipeFormModal
      title="Add New Recipe"
      submitLabel="Create Recipe"
      onClose={onClose}
      onSubmit={onAdd}
      emojis={emojis}
      existingRecipes={existingRecipes}
    />
  );
}

export default AddRecipeModal;
