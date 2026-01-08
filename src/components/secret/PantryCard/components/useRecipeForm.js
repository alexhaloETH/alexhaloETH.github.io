import { useMemo, useState } from 'react';

const DEFAULT_RECIPE = {
  name: '',
  time: '15 min',
  difficulty: 'Easy',
  servings: 2,
  icon: '🍳',
  ingredients: [{ name: '', amount: 1, unit: 'pcs', optional: false }],
  steps: [{ instruction: '', tip: '' }],
  tags: [],
  alex_score: 5,
  notes: '',
  url: '',
};

const useRecipeForm = ({ initialRecipe, existingRecipes = [] }) => {
  const initialData = {
    ...DEFAULT_RECIPE,
    ...initialRecipe,
    ingredients: initialRecipe?.ingredients?.length
      ? initialRecipe.ingredients
      : DEFAULT_RECIPE.ingredients,
    steps: initialRecipe?.steps?.length
      ? initialRecipe.steps
      : DEFAULT_RECIPE.steps,
    tags: initialRecipe?.tags || DEFAULT_RECIPE.tags,
    alex_score: initialRecipe?.alex_score ?? DEFAULT_RECIPE.alex_score,
    notes: initialRecipe?.notes ?? DEFAULT_RECIPE.notes,
    url: initialRecipe?.url ?? DEFAULT_RECIPE.url,
  };

  const [name, setName] = useState(initialData.name);
  const [time, setTime] = useState(initialData.time);
  const [difficulty, setDifficulty] = useState(initialData.difficulty);
  const [servings, setServings] = useState(initialData.servings);
  const [icon, setIcon] = useState(initialData.icon);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ingredients, setIngredients] = useState(initialData.ingredients);
  const [steps, setSteps] = useState(initialData.steps);
  const [tags, setTags] = useState(initialData.tags);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [alexScore, setAlexScore] = useState(initialData.alex_score);
  const [notes, setNotes] = useState(initialData.notes);
  const [url, setUrl] = useState(initialData.url);

  const allExistingTags = useMemo(() => (
    [...new Set(
      existingRecipes
        .filter(r => r.tags && Array.isArray(r.tags))
        .flatMap(r => r.tags)
    )].sort()
  ), [existingRecipes]);

  const filteredSuggestions = useMemo(() => (
    allExistingTags.filter(tag =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag)
    )
  ), [allExistingTags, tagInput, tags]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'pcs', optional: false }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients(ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const handleAddStep = () => {
    setSteps([...steps, { instruction: '', tip: '' }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    setSteps(steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    ));
  };

  const handleAddTag = (tagToAdd = null) => {
    const tag = tagToAdd || tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    setShowTagSuggestions(e.target.value.length > 0);
  };

  const buildPayload = ({ preserveStepMedia }) => {
    if (!name.trim()) return null;

    const validIngredients = ingredients.filter(i => i.name.trim());
    const validSteps = steps.filter(s => s.instruction.trim());

    if (validIngredients.length === 0) return null;
    if (validSteps.length === 0) return null;

    return {
      name: name.trim(),
      time,
      difficulty,
      servings,
      icon,
      url: url.trim() || null,
      ingredients: validIngredients.map(i => ({
        name: i.name,
        amount: Number(i.amount),
        unit: i.unit,
        optional: i.optional || false
      })),
      steps: validSteps.map(s => ({
        instruction: s.instruction,
        tip: s.tip || null,
        image: preserveStepMedia ? (s.image || null) : null,
        url: preserveStepMedia ? (s.url || null) : null
      })),
      tags: tags.length > 0 ? tags : null,
      alex_score: alexScore,
      notes: notes.trim() || null,
    };
  };

  return {
    name,
    setName,
    time,
    setTime,
    difficulty,
    setDifficulty,
    servings,
    setServings,
    icon,
    setIcon,
    showEmojiPicker,
    setShowEmojiPicker,
    ingredients,
    steps,
    tags,
    tagInput,
    showTagSuggestions,
    setShowTagSuggestions,
    alexScore,
    setAlexScore,
    notes,
    setNotes,
    url,
    setUrl,
    allExistingTags,
    filteredSuggestions,
    handleAddIngredient,
    handleRemoveIngredient,
    handleIngredientChange,
    handleAddStep,
    handleRemoveStep,
    handleStepChange,
    handleAddTag,
    handleRemoveTag,
    handleTagKeyPress,
    handleTagInputChange,
    buildPayload,
  };
};

export default useRecipeForm;
