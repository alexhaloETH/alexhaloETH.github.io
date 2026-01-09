const PANTRY_TABS = [
  { id: 'recipes', label: 'What Can I Make?', icon: '🍳', resource: 'recipes' },
  { id: 'pantry', label: 'Pantry', icon: '🏠', resource: 'pantry' },
  { id: 'shopping', label: 'Shopping', icon: '🛒', resource: 'shopping' },
];

const PANTRY_CATEGORIES = [
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'meat', label: 'Meat', icon: '🥩' },
  { id: 'seafood', label: 'Seafood', icon: '🦐' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'bakery', label: 'Bakery', icon: '🍞' },
  { id: 'pantry', label: 'Pantry', icon: '🏠' },
];

const COMMON_EMOJIS = [
  '🥚', '🥛', '🧈', '🍞', '🧀', '🥓', '🍅', '🧅', '🧄', '🍝', '🍚', '🍗', '🫑', '🍄',
  '🫒', '🥔', '🥕', '🥒', '🥬', '🌽', '🥦', '🍎', '🍌', '🍊', '🍓', '🍇', '🥩', '🦐',
  '🌾', '🧂', '🌶️', '🫗', '🍯', '🥑', '🍋', '🐟', '☕', '🥜', '🥥', '🫘',
];

const RECIPES_PER_PAGE = 30;

export { COMMON_EMOJIS, PANTRY_CATEGORIES, PANTRY_TABS, RECIPES_PER_PAGE };
