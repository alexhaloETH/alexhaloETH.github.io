// Helper function to check if a recipe can be made with current pantry
export function canMakeRecipe(recipe, pantry) {
  const missing = [];
  let canMake = true;

  for (const ingredient of recipe.ingredients) {
    // Skip optional ingredients in the availability check
    if (ingredient.optional) {
      continue;
    }

    const pantryItem = pantry.find(
      (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (!pantryItem || pantryItem.quantity < ingredient.amount) {
      canMake = false;
      missing.push({
        name: ingredient.name,
        needed: ingredient.amount,
        have: pantryItem?.quantity || 0,
        unit: ingredient.unit,
      });
    }
  }

  return { canMake, missing };
}
