import RecipeFormModal from './RecipeFormModal';

function EditRecipeModal({ recipe, onClose, onUpdate, emojis, existingRecipes = [] }) {
  return (
    <RecipeFormModal
      title="Edit Recipe"
      submitLabel="Update Recipe"
      onClose={onClose}
      onSubmit={onUpdate}
      emojis={emojis}
      existingRecipes={existingRecipes}
      initialRecipe={recipe}
      preserveStepMedia
    />
  );
}

export default EditRecipeModal;
