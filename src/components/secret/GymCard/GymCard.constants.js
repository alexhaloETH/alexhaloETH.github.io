export const TABS = {
  DASHBOARD: 'dashboard',
  PLAN: 'plan',
  EXERCISES: 'exercises',
  STRETCHING: 'stretching',
  ANALYTICS: 'analytics',
  BODYWEIGHT: 'bodyweight',
};

export const CATEGORIES = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobility' },
];

export const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'cable', label: 'Cable' },
  { value: 'machine', label: 'Machine' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'pullup_bar', label: 'Pull-up Bar' },
  { value: 'bands', label: 'Bands' },
  { value: 'none', label: 'None' },
];

export const EXERCISE_TYPES = [
  { value: 'strength', label: 'Strength' },
  { value: 'hypertrophy', label: 'Hypertrophy' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'stretch', label: 'Stretch' },
  { value: 'warmup', label: 'Warmup' },
  { value: 'conditioning', label: 'Conditioning' },
];

export const DAY_TYPES = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'rest', label: 'Rest' },
];

export const STRETCH_TYPES = [
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'static', label: 'Static' },
  { value: 'mobility', label: 'Mobility' },
];

export const BODY_AREAS = [
  { value: 'upper_body', label: 'Upper Body' },
  { value: 'lower_body', label: 'Lower Body' },
  { value: 'full_body', label: 'Full Body' },
  { value: 'hips', label: 'Hips' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
];

export const RECOMMENDED_USES = [
  { value: 'pre_workout', label: 'Pre-Workout' },
  { value: 'post_upper', label: 'Post Upper' },
  { value: 'post_lower', label: 'Post Lower' },
  { value: 'rest_day', label: 'Rest Day' },
  { value: 'custom', label: 'Custom' },
];

export const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export const RATING_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export const getCategoryLabel = (value) => (
  CATEGORIES.find((c) => c.value === value)?.label || value
);

export const getEquipmentLabel = (value) => (
  EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value
);

export const getDayTypeLabel = (value) => (
  DAY_TYPES.find((d) => d.value === value)?.label || value
);

export const getBodyAreaLabel = (value) => (
  BODY_AREAS.find((b) => b.value === value)?.label || value.replace('_', ' ')
);

export const getRecommendedUseLabel = (value) => (
  RECOMMENDED_USES.find((r) => r.value === value)?.label || value.replace('_', ' ')
);

export const getDayName = (dayNumber) => (
  DAYS_OF_WEEK.find((d) => d.value === dayNumber)?.label || `Day ${dayNumber}`
);
