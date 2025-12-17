// Mock pantry data - will be replaced with API calls
export const pantryItems = [
  { id: 1, name: 'Eggs', quantity: 4, unit: 'pcs', category: 'dairy', icon: '🥚' },
  { id: 2, name: 'Milk', quantity: 500, unit: 'ml', category: 'dairy', icon: '🥛' },
  { id: 3, name: 'Butter', quantity: 100, unit: 'g', category: 'dairy', icon: '🧈' },
  { id: 4, name: 'Bread', quantity: 6, unit: 'slices', category: 'bakery', icon: '🍞' },
  { id: 5, name: 'Cheese', quantity: 150, unit: 'g', category: 'dairy', icon: '🧀' },
  { id: 6, name: 'Bacon', quantity: 200, unit: 'g', category: 'meat', icon: '🥓' },
  { id: 7, name: 'Tomatoes', quantity: 3, unit: 'pcs', category: 'vegetables', icon: '🍅' },
  { id: 8, name: 'Onion', quantity: 2, unit: 'pcs', category: 'vegetables', icon: '🧅' },
  { id: 9, name: 'Garlic', quantity: 5, unit: 'cloves', category: 'vegetables', icon: '🧄' },
  { id: 10, name: 'Pasta', quantity: 500, unit: 'g', category: 'pantry', icon: '🍝' },
  { id: 11, name: 'Rice', quantity: 1000, unit: 'g', category: 'pantry', icon: '🍚' },
  { id: 12, name: 'Chicken', quantity: 400, unit: 'g', category: 'meat', icon: '🍗' },
  { id: 13, name: 'Bell Pepper', quantity: 2, unit: 'pcs', category: 'vegetables', icon: '🫑' },
  { id: 14, name: 'Mushrooms', quantity: 200, unit: 'g', category: 'vegetables', icon: '🍄' },
  { id: 15, name: 'Olive Oil', quantity: 400, unit: 'ml', category: 'pantry', icon: '🫒' },
];

// Shopping list - items to buy
export const shoppingList = [
  { id: 1, name: 'Avocados', quantity: 3, unit: 'pcs', checked: false, icon: '🥑' },
  { id: 2, name: 'Lemons', quantity: 4, unit: 'pcs', checked: false, icon: '🍋' },
  { id: 3, name: 'Salmon', quantity: 300, unit: 'g', checked: false, icon: '🐟' },
  { id: 4, name: 'Greek Yogurt', quantity: 500, unit: 'g', checked: true, icon: '🥛' },
  { id: 5, name: 'Spinach', quantity: 200, unit: 'g', checked: false, icon: '🥬' },
  { id: 6, name: 'Coffee', quantity: 250, unit: 'g', checked: true, icon: '☕' },
];

// Recipes with required ingredients and instructions
export const recipes = [
  {
    id: 1,
    name: 'Classic Omelette',
    time: '10 min',
    difficulty: 'Easy',
    icon: '🍳',
    servings: 1,
    ingredients: [
      { name: 'Eggs', amount: 3, unit: 'pcs' },
      { name: 'Butter', amount: 15, unit: 'g' },
      { name: 'Cheese', amount: 30, unit: 'g' },
    ],
    steps: [
      { instruction: 'Crack eggs into a bowl and whisk until fully combined', tip: 'Add a splash of milk for extra fluffiness' },
      { instruction: 'Heat butter in a non-stick pan over medium-low heat', tip: 'Don\'t let the butter brown' },
      { instruction: 'Pour in the eggs and let them set for 30 seconds', tip: null },
      { instruction: 'Gently push edges toward center, tilting pan to let uncooked egg flow', tip: 'Work quickly but gently' },
      { instruction: 'When almost set, add cheese to one half', tip: null },
      { instruction: 'Fold omelette in half and slide onto plate', tip: 'Should be slightly runny inside' },
    ],
  },
  {
    id: 2,
    name: 'Bacon & Eggs',
    time: '15 min',
    difficulty: 'Easy',
    icon: '🥓',
    servings: 1,
    ingredients: [
      { name: 'Eggs', amount: 2, unit: 'pcs' },
      { name: 'Bacon', amount: 100, unit: 'g' },
      { name: 'Butter', amount: 10, unit: 'g' },
    ],
    steps: [
      { instruction: 'Place bacon strips in a cold pan', tip: 'Starting cold renders fat better' },
      { instruction: 'Cook over medium heat, flipping occasionally, until desired crispiness', tip: '8-10 minutes for crispy bacon' },
      { instruction: 'Remove bacon and drain on paper towels', tip: null },
      { instruction: 'Pour off most bacon fat, add butter to pan', tip: 'Leave some bacon fat for flavor' },
      { instruction: 'Crack eggs into pan and cook to your preference', tip: 'Cover pan for over-easy eggs' },
      { instruction: 'Season with salt and pepper, serve with bacon', tip: null },
    ],
  },
  {
    id: 3,
    name: 'Grilled Cheese',
    time: '10 min',
    difficulty: 'Easy',
    icon: '🧀',
    servings: 1,
    ingredients: [
      { name: 'Bread', amount: 2, unit: 'slices' },
      { name: 'Cheese', amount: 50, unit: 'g' },
      { name: 'Butter', amount: 20, unit: 'g' },
    ],
    steps: [
      { instruction: 'Butter one side of each bread slice generously', tip: 'Room temperature butter spreads easier' },
      { instruction: 'Place one slice butter-side down in cold pan', tip: null },
      { instruction: 'Add cheese slices on top of bread', tip: 'Mix cheese types for better flavor' },
      { instruction: 'Top with second slice, butter-side up', tip: null },
      { instruction: 'Cook over medium-low heat until golden, about 3-4 minutes', tip: 'Low and slow = better melt' },
      { instruction: 'Flip carefully and cook other side until golden and cheese melts', tip: null },
    ],
  },
  {
    id: 4,
    name: 'Pasta Carbonara',
    time: '25 min',
    difficulty: 'Medium',
    icon: '🍝',
    servings: 2,
    ingredients: [
      { name: 'Pasta', amount: 200, unit: 'g' },
      { name: 'Eggs', amount: 2, unit: 'pcs' },
      { name: 'Bacon', amount: 100, unit: 'g' },
      { name: 'Cheese', amount: 50, unit: 'g' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
    ],
    steps: [
      { instruction: 'Bring large pot of salted water to boil, cook pasta until al dente', tip: 'Save 1 cup pasta water before draining' },
      { instruction: 'While pasta cooks, whisk eggs with grated cheese in a bowl', tip: 'This is your sauce base' },
      { instruction: 'Cut bacon into small pieces and cook until crispy', tip: null },
      { instruction: 'Add minced garlic to bacon, cook 30 seconds until fragrant', tip: 'Don\'t burn the garlic' },
      { instruction: 'Drain pasta, add to bacon pan OFF the heat', tip: 'Heat will scramble the eggs!' },
      { instruction: 'Quickly toss with egg mixture, adding pasta water to loosen', tip: 'Toss vigorously to create creamy sauce' },
      { instruction: 'Season with black pepper and serve immediately', tip: null },
    ],
  },
  {
    id: 5,
    name: 'Chicken Stir Fry',
    time: '20 min',
    difficulty: 'Medium',
    icon: '🍗',
    servings: 2,
    ingredients: [
      { name: 'Chicken', amount: 200, unit: 'g' },
      { name: 'Bell Pepper', amount: 1, unit: 'pcs' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Garlic', amount: 2, unit: 'cloves' },
      { name: 'Olive Oil', amount: 30, unit: 'ml' },
    ],
    steps: [
      { instruction: 'Cut chicken into bite-sized pieces, season with salt and pepper', tip: 'Pat chicken dry for better browning' },
      { instruction: 'Slice bell pepper and onion into strips, mince garlic', tip: 'Prep everything before you start cooking' },
      { instruction: 'Heat oil in wok or large pan over high heat until smoking', tip: 'High heat is key for stir fry' },
      { instruction: 'Add chicken in single layer, don\'t move for 2 minutes', tip: 'Let it sear and get color' },
      { instruction: 'Stir and cook until chicken is cooked through, remove from pan', tip: null },
      { instruction: 'Add more oil, stir fry vegetables for 2-3 minutes until crisp-tender', tip: null },
      { instruction: 'Return chicken to pan, add garlic, toss for 30 seconds', tip: 'Add soy sauce if desired' },
    ],
  },
  {
    id: 6,
    name: 'Mushroom Risotto',
    time: '35 min',
    difficulty: 'Medium',
    icon: '🍄',
    servings: 2,
    ingredients: [
      { name: 'Rice', amount: 200, unit: 'g' },
      { name: 'Mushrooms', amount: 150, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
      { name: 'Butter', amount: 30, unit: 'g' },
      { name: 'Cheese', amount: 40, unit: 'g' },
    ],
    steps: [
      { instruction: 'Heat 1L of water or stock and keep it simmering', tip: 'Hot liquid is essential for risotto' },
      { instruction: 'Sauté sliced mushrooms in half the butter until golden, set aside', tip: 'Don\'t crowd the pan' },
      { instruction: 'In same pan, cook diced onion in remaining butter until soft', tip: 'About 5 minutes on medium heat' },
      { instruction: 'Add rice and stir for 1-2 minutes until edges are translucent', tip: 'This toasts the rice' },
      { instruction: 'Add hot liquid one ladle at a time, stirring until absorbed', tip: 'Keep stirring - this releases starch' },
      { instruction: 'Continue for 18-20 minutes until rice is creamy but al dente', tip: null },
      { instruction: 'Stir in mushrooms, cheese, and season to taste', tip: 'Add more butter for extra richness' },
    ],
  },
  {
    id: 7,
    name: 'Bruschetta',
    time: '15 min',
    difficulty: 'Easy',
    icon: '🍅',
    servings: 4,
    ingredients: [
      { name: 'Bread', amount: 4, unit: 'slices' },
      { name: 'Tomatoes', amount: 2, unit: 'pcs' },
      { name: 'Garlic', amount: 1, unit: 'cloves' },
      { name: 'Olive Oil', amount: 20, unit: 'ml' },
    ],
    steps: [
      { instruction: 'Dice tomatoes and place in bowl, season with salt', tip: 'Let sit 5 min to draw out juices' },
      { instruction: 'Add olive oil and mix gently', tip: 'Add fresh basil if you have it' },
      { instruction: 'Toast or grill bread slices until golden and crispy', tip: 'A char adds great flavor' },
      { instruction: 'Cut garlic clove in half and rub on warm bread', tip: 'The rough surface grates the garlic' },
      { instruction: 'Drizzle bread with olive oil', tip: null },
      { instruction: 'Top with tomato mixture and serve immediately', tip: 'Don\'t let it sit or bread gets soggy' },
    ],
  },
  {
    id: 8,
    name: 'French Toast',
    time: '15 min',
    difficulty: 'Easy',
    icon: '🍞',
    servings: 2,
    ingredients: [
      { name: 'Bread', amount: 4, unit: 'slices' },
      { name: 'Eggs', amount: 2, unit: 'pcs' },
      { name: 'Milk', amount: 100, unit: 'ml' },
      { name: 'Butter', amount: 20, unit: 'g' },
    ],
    steps: [
      { instruction: 'Whisk eggs and milk together in a shallow dish', tip: 'Add vanilla and cinnamon for extra flavor' },
      { instruction: 'Heat butter in a pan over medium heat', tip: null },
      { instruction: 'Dip bread slices in egg mixture, coating both sides', tip: 'Don\'t soak too long or it falls apart' },
      { instruction: 'Place in pan and cook until golden brown, about 2-3 minutes', tip: null },
      { instruction: 'Flip and cook other side until golden', tip: null },
      { instruction: 'Serve with maple syrup, powdered sugar, or fresh fruit', tip: 'Warm plates keep it hot longer' },
    ],
  },
];

// Helper function to check if a recipe can be made with current pantry
export function canMakeRecipe(recipe, pantry) {
  const missing = [];
  let canMake = true;

  for (const ingredient of recipe.ingredients) {
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

// Get all recipes sorted by availability
export function getRecipesByAvailability(pantry) {
  return recipes
    .map((recipe) => {
      const { canMake, missing } = canMakeRecipe(recipe, pantry);
      const matchedCount = recipe.ingredients.length - missing.length;
      const matchPercentage = (matchedCount / recipe.ingredients.length) * 100;

      return {
        ...recipe,
        canMake,
        missing,
        matchPercentage,
        matchedCount,
      };
    })
    .sort((a, b) => {
      // Sort by canMake first, then by match percentage
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;
      return b.matchPercentage - a.matchPercentage;
    });
}
