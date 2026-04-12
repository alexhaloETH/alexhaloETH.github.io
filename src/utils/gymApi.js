import { apiRequest, withErrorContext } from './apiClient';

// ============================================================================
// Helper Functions
// ============================================================================

const normalizeString = (value) => (typeof value === 'string' ? value : '');

const toOptionalString = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const toOptionalNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toOptionalInteger = (value) => {
  const num = toOptionalNumber(value);
  return num !== null ? Math.floor(num) : null;
};

// ============================================================================
// Transform Functions (API -> Frontend)
// ============================================================================

const transformExercise = (exercise) => ({
  id: exercise.id,
  name: normalizeString(exercise.name),
  category: normalizeString(exercise.category),
  equipment: normalizeString(exercise.equipment),
  exerciseType: normalizeString(exercise.exercise_type),
  primaryMuscles: exercise.primary_muscles ? JSON.parse(exercise.primary_muscles) : [],
  instructions: normalizeString(exercise.instructions),
  videoUrl: normalizeString(exercise.video_url),
  isActive: Boolean(exercise.is_active),
  createdAt: normalizeString(exercise.created_at),
  updatedAt: normalizeString(exercise.updated_at),
});

const transformStretch = (stretch) => ({
  id: stretch.id,
  name: normalizeString(stretch.name),
  stretchType: normalizeString(stretch.stretch_type),
  bodyArea: normalizeString(stretch.body_area),
  instructions: normalizeString(stretch.instructions),
  holdSeconds: stretch.hold_seconds ?? 30,
  reps: stretch.reps,
  difficulty: normalizeString(stretch.difficulty),
  recommendedUse: normalizeString(stretch.recommended_use),
  isActive: Boolean(stretch.is_active),
  createdAt: normalizeString(stretch.created_at),
});

const transformWorkoutPlan = (plan) => ({
  id: plan.id,
  name: normalizeString(plan.name),
  description: normalizeString(plan.description),
  planType: normalizeString(plan.plan_type),
  daysPerWeek: plan.days_per_week ?? 4,
  difficulty: normalizeString(plan.difficulty),
  isTemplate: Boolean(plan.is_template),
  isActive: Boolean(plan.is_active),
  createdAt: normalizeString(plan.created_at),
  updatedAt: normalizeString(plan.updated_at),
});

const transformPlanDay = (day) => ({
  id: day.id,
  planId: day.plan_id,
  dayNumber: day.day_number,
  name: normalizeString(day.name),
  dayType: normalizeString(day.day_type),
  description: normalizeString(day.description),
  estimatedMinutes: day.estimated_minutes,
  sortOrder: day.sort_order ?? 0,
  createdAt: normalizeString(day.created_at),
});

const transformDayExercise = (dayExercise) => ({
  id: dayExercise.id,
  planDayId: dayExercise.plan_day_id,
  exerciseId: dayExercise.exercise_id,
  sortOrder: dayExercise.sort_order ?? 0,
  sets: dayExercise.sets ?? 3,
  repsMin: dayExercise.reps_min,
  repsMax: dayExercise.reps_max,
  targetWeight: dayExercise.target_weight,
  targetTimeSeconds: dayExercise.target_time_seconds,
  targetDistance: dayExercise.target_distance,
  restSeconds: dayExercise.rest_seconds ?? 90,
  notes: normalizeString(dayExercise.notes),
  createdAt: normalizeString(dayExercise.created_at),
});

const transformDayExerciseWithDetails = (item) => ({
  ...transformDayExercise(item),
  exercise: transformExercise(item.exercise),
});

const transformPlanDayWithExercises = (day) => ({
  ...transformPlanDay(day),
  exercises: (day.exercises || []).map(transformDayExerciseWithDetails),
});

const transformWorkoutPlanWithDays = (plan) => ({
  ...transformWorkoutPlan(plan),
  days: (plan.days || []).map(transformPlanDayWithExercises),
});

const transformPlanAssignment = (assignment) => ({
  id: assignment.id,
  userId: assignment.user_id,
  planId: assignment.plan_id,
  startedAt: normalizeString(assignment.started_at),
  endedAt: normalizeString(assignment.ended_at),
  isActive: Boolean(assignment.is_active),
  currentWeek: assignment.current_week ?? 1,
  createdAt: normalizeString(assignment.created_at),
});

const transformWorkoutSession = (session) => ({
  id: session.id,
  userId: session.user_id,
  planDayId: session.plan_day_id,
  sessionDate: normalizeString(session.session_date),
  startedAt: normalizeString(session.started_at),
  endedAt: normalizeString(session.ended_at),
  durationMinutes: session.duration_minutes,
  notes: normalizeString(session.notes),
  energyRating: session.energy_rating,
  workoutRating: session.workout_rating,
  sorenessRating: session.soreness_rating,
  completed: Boolean(session.completed),
  createdAt: normalizeString(session.created_at),
});

const transformSessionSet = (set) => ({
  id: set.id,
  sessionExerciseId: set.session_exercise_id,
  setNumber: set.set_number,
  reps: set.reps,
  weight: set.weight,
  durationSeconds: set.duration_seconds,
  distance: set.distance,
  rpe: set.rpe,
  isWarmup: Boolean(set.is_warmup),
  notes: normalizeString(set.notes),
  createdAt: normalizeString(set.created_at),
  sessionDate: normalizeString(set.session_date),
});

const transformSessionExercise = (sessionExercise) => ({
  id: sessionExercise.id,
  sessionId: sessionExercise.session_id,
  exerciseId: sessionExercise.exercise_id,
  sortOrder: sessionExercise.sort_order ?? 0,
  notes: normalizeString(sessionExercise.notes),
  skipped: Boolean(sessionExercise.skipped),
  createdAt: normalizeString(sessionExercise.created_at),
});

const transformSessionExerciseWithSets = (item) => ({
  ...transformSessionExercise(item),
  exercise: transformExercise(item.exercise),
  sets: (item.sets || []).map(transformSessionSet),
});

const transformWorkoutSessionWithExercises = (session) => ({
  ...transformWorkoutSession(session),
  exercises: (session.exercises || []).map(transformSessionExerciseWithSets),
});

const transformBodyweightLog = (log) => ({
  id: log.id,
  userId: log.user_id,
  logDate: normalizeString(log.log_date),
  weight: log.weight,
  bodyFatPercent: log.body_fat_percent,
  notes: normalizeString(log.notes),
  createdAt: normalizeString(log.created_at),
});

const transformStretchLog = (log) => ({
  id: log.id,
  userId: log.user_id,
  logDate: normalizeString(log.log_date),
  routineType: normalizeString(log.routine_type),
  durationMinutes: log.duration_minutes,
  notes: normalizeString(log.notes),
  createdAt: normalizeString(log.created_at),
  items: (log.items || []).map((item) => ({
    id: item.id,
    stretchLogId: item.stretch_log_id,
    stretchId: item.stretch_id,
    durationSeconds: item.duration_seconds,
    sets: item.sets ?? 1,
    completed: Boolean(item.completed),
    createdAt: normalizeString(item.created_at),
    stretch: transformStretch(item.stretch),
  })),
});

const transformPersonalRecord = (pr) => ({
  exerciseId: pr.exercise_id,
  exerciseName: normalizeString(pr.exercise_name),
  weight: pr.weight,
  reps: pr.reps,
  estimated1rm: pr.estimated_1rm,
  achievedAt: normalizeString(pr.achieved_at),
});

const transformAnalytics = (analytics) => ({
  workoutStreak: analytics.workout_streak ?? 0,
  workoutsThisWeek: analytics.workouts_this_week ?? 0,
  workoutsThisMonth: analytics.workouts_this_month ?? 0,
  totalWorkouts: analytics.total_workouts ?? 0,
  totalVolumeThisWeek: analytics.total_volume_this_week ?? 0,
  personalRecords: (analytics.personal_records || []).map(transformPersonalRecord),
  recentBodyweight: analytics.recent_bodyweight,
  bodyweightChange30d: analytics.bodyweight_change_30d,
});

const transformExerciseAnalytics = (analytics) => ({
  exercise: transformExercise(analytics.exercise),
  personalRecord: analytics.personal_record
    ? transformPersonalRecord(analytics.personal_record)
    : null,
  recentSets: (analytics.recent_sets || []).map(transformSessionSet),
  volumeTrend: (analytics.volume_trend || []).map((point) => ({
    date: normalizeString(point.date),
    totalVolume: point.total_volume ?? 0,
    totalSets: point.total_sets ?? 0,
  })),
});

// ============================================================================
// Transform Functions (Frontend -> API)
// ============================================================================

const transformExerciseToBackend = (exercise) => ({
  name: exercise.name.trim(),
  category: exercise.category,
  equipment: toOptionalString(exercise.equipment),
  exercise_type: exercise.exerciseType || 'strength',
  primary_muscles: exercise.primaryMuscles
    ? JSON.stringify(exercise.primaryMuscles)
    : null,
  instructions: toOptionalString(exercise.instructions),
  video_url: toOptionalString(exercise.videoUrl),
  is_active: exercise.isActive !== false,
});

const transformStretchToBackend = (stretch) => ({
  name: stretch.name.trim(),
  stretch_type: stretch.stretchType || 'static',
  body_area: stretch.bodyArea,
  instructions: toOptionalString(stretch.instructions),
  hold_seconds: toOptionalInteger(stretch.holdSeconds),
  reps: toOptionalInteger(stretch.reps),
  difficulty: stretch.difficulty || 'beginner',
  recommended_use: toOptionalString(stretch.recommendedUse),
  is_active: stretch.isActive !== false,
});

const transformPlanToBackend = (plan) => ({
  name: plan.name.trim(),
  description: toOptionalString(plan.description),
  plan_type: plan.planType || 'hybrid',
  days_per_week: toOptionalInteger(plan.daysPerWeek) || 4,
  difficulty: plan.difficulty || 'beginner',
  is_template: Boolean(plan.isTemplate),
  is_active: plan.isActive !== false,
});

const transformPlanDayToBackend = (day) => ({
  day_number: day.dayNumber,
  name: day.name.trim(),
  day_type: day.dayType || 'gym',
  description: toOptionalString(day.description),
  estimated_minutes: toOptionalInteger(day.estimatedMinutes),
  sort_order: toOptionalInteger(day.sortOrder) || 0,
});

const transformDayExerciseToBackend = (dayExercise) => ({
  exercise_id: dayExercise.exerciseId,
  sort_order: toOptionalInteger(dayExercise.sortOrder) || 0,
  sets: toOptionalInteger(dayExercise.sets) || 3,
  reps_min: toOptionalInteger(dayExercise.repsMin),
  reps_max: toOptionalInteger(dayExercise.repsMax),
  target_weight: toOptionalNumber(dayExercise.targetWeight),
  target_time_seconds: toOptionalInteger(dayExercise.targetTimeSeconds),
  target_distance: toOptionalNumber(dayExercise.targetDistance),
  rest_seconds: toOptionalInteger(dayExercise.restSeconds) || 90,
  notes: toOptionalString(dayExercise.notes),
});

const transformSessionToBackend = (session) => ({
  plan_day_id: session.planDayId || null,
  session_date: session.sessionDate,
  started_at: toOptionalString(session.startedAt),
  notes: toOptionalString(session.notes),
});

const transformSessionUpdateToBackend = (session) => ({
  ended_at: toOptionalString(session.endedAt),
  duration_minutes: toOptionalInteger(session.durationMinutes),
  notes: toOptionalString(session.notes),
  energy_rating: toOptionalInteger(session.energyRating),
  workout_rating: toOptionalInteger(session.workoutRating),
  soreness_rating: toOptionalInteger(session.sorenessRating),
  completed: Boolean(session.completed),
});

const transformSessionSetToBackend = (set) => ({
  set_number: set.setNumber,
  reps: toOptionalInteger(set.reps),
  weight: toOptionalNumber(set.weight),
  duration_seconds: toOptionalInteger(set.durationSeconds),
  distance: toOptionalNumber(set.distance),
  rpe: toOptionalInteger(set.rpe),
  is_warmup: Boolean(set.isWarmup),
  notes: toOptionalString(set.notes),
});

const transformBodyweightToBackend = (log) => ({
  log_date: log.logDate,
  weight: Number(log.weight),
  body_fat_percent: toOptionalNumber(log.bodyFatPercent),
  notes: toOptionalString(log.notes),
});

const transformStretchLogToBackend = (log) => ({
  log_date: log.logDate,
  routine_type: log.routineType || 'custom',
  duration_minutes: toOptionalInteger(log.durationMinutes),
  notes: toOptionalString(log.notes),
  items: log.items?.map((item) => ({
    stretch_id: item.stretchId,
    duration_seconds: toOptionalInteger(item.durationSeconds),
    sets: toOptionalInteger(item.sets) || 1,
    completed: item.completed !== false,
  })),
});

// ============================================================================
// API Functions - Exercises
// ============================================================================

export const getAllExercises = async (filters = {}) =>
  withErrorContext('Error fetching exercises', async () => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.equipment) params.append('equipment', filters.equipment);
    if (filters.exerciseType) params.append('exercise_type', filters.exerciseType);
    if (filters.activeOnly !== undefined) params.append('active_only', filters.activeOnly);

    const queryString = params.toString();
    const data = await apiRequest(`/gym/exercises${queryString ? `?${queryString}` : ''}`);
    return data.map(transformExercise);
  });

export const getExercise = async (id) =>
  withErrorContext(`Error fetching exercise ${id}`, async () => {
    const data = await apiRequest(`/gym/exercises/${id}`);
    return transformExercise(data);
  });

export const createExercise = async (exercise) =>
  withErrorContext('Error creating exercise', () =>
    apiRequest('/gym/exercises', {
      method: 'POST',
      body: transformExerciseToBackend(exercise),
    }),
  );

export const updateExercise = async (id, exercise) =>
  withErrorContext(`Error updating exercise ${id}`, () =>
    apiRequest(`/gym/exercises/${id}`, {
      method: 'PUT',
      body: transformExerciseToBackend(exercise),
    }),
  );

export const deleteExercise = async (id) =>
  withErrorContext(`Error deleting exercise ${id}`, () =>
    apiRequest(`/gym/exercises/${id}`, { method: 'DELETE' }),
  );

// ============================================================================
// API Functions - Stretches
// ============================================================================

export const getAllStretches = async (filters = {}) =>
  withErrorContext('Error fetching stretches', async () => {
    const params = new URLSearchParams();
    if (filters.bodyArea) params.append('body_area', filters.bodyArea);
    if (filters.stretchType) params.append('stretch_type', filters.stretchType);
    if (filters.recommendedUse) params.append('recommended_use', filters.recommendedUse);
    if (filters.activeOnly !== undefined) params.append('active_only', filters.activeOnly);

    const queryString = params.toString();
    const data = await apiRequest(`/gym/stretches${queryString ? `?${queryString}` : ''}`);
    return data.map(transformStretch);
  });

export const getStretch = async (id) =>
  withErrorContext(`Error fetching stretch ${id}`, async () => {
    const data = await apiRequest(`/gym/stretches/${id}`);
    return transformStretch(data);
  });

export const createStretch = async (stretch) =>
  withErrorContext('Error creating stretch', () =>
    apiRequest('/gym/stretches', {
      method: 'POST',
      body: transformStretchToBackend(stretch),
    }),
  );

export const updateStretch = async (id, stretch) =>
  withErrorContext(`Error updating stretch ${id}`, () =>
    apiRequest(`/gym/stretches/${id}`, {
      method: 'PUT',
      body: transformStretchToBackend(stretch),
    }),
  );

export const deleteStretch = async (id) =>
  withErrorContext(`Error deleting stretch ${id}`, () =>
    apiRequest(`/gym/stretches/${id}`, { method: 'DELETE' }),
  );

// ============================================================================
// API Functions - Plans
// ============================================================================

export const getAllPlans = async () =>
  withErrorContext('Error fetching workout plans', async () => {
    const data = await apiRequest('/gym/plans');
    return data.map(transformWorkoutPlan);
  });

export const getPlan = async (id) =>
  withErrorContext(`Error fetching workout plan ${id}`, async () => {
    const data = await apiRequest(`/gym/plans/${id}`);
    return transformWorkoutPlanWithDays(data);
  });

export const createPlan = async (plan) =>
  withErrorContext('Error creating workout plan', () =>
    apiRequest('/gym/plans', {
      method: 'POST',
      body: transformPlanToBackend(plan),
    }),
  );

export const updatePlan = async (id, plan) =>
  withErrorContext(`Error updating workout plan ${id}`, () =>
    apiRequest(`/gym/plans/${id}`, {
      method: 'PUT',
      body: transformPlanToBackend(plan),
    }),
  );

export const deletePlan = async (id) =>
  withErrorContext(`Error deleting workout plan ${id}`, () =>
    apiRequest(`/gym/plans/${id}`, { method: 'DELETE' }),
  );

export const addPlanDay = async (planId, day) =>
  withErrorContext('Error adding plan day', () =>
    apiRequest(`/gym/plans/${planId}/days`, {
      method: 'POST',
      body: transformPlanDayToBackend(day),
    }),
  );

export const updatePlanDay = async (id, day) =>
  withErrorContext(`Error updating plan day ${id}`, () =>
    apiRequest(`/gym/plans/days/${id}`, {
      method: 'PUT',
      body: transformPlanDayToBackend(day),
    }),
  );

export const deletePlanDay = async (id) =>
  withErrorContext(`Error deleting plan day ${id}`, () =>
    apiRequest(`/gym/plans/days/${id}`, { method: 'DELETE' }),
  );

export const addDayExercise = async (dayId, exercise) =>
  withErrorContext('Error adding exercise to day', () =>
    apiRequest(`/gym/plans/days/${dayId}/exercises`, {
      method: 'POST',
      body: transformDayExerciseToBackend(exercise),
    }),
  );

export const updateDayExercise = async (id, exercise) =>
  withErrorContext(`Error updating day exercise ${id}`, () =>
    apiRequest(`/gym/plans/day-exercises/${id}`, {
      method: 'PUT',
      body: transformDayExerciseToBackend(exercise),
    }),
  );

export const deleteDayExercise = async (id) =>
  withErrorContext(`Error deleting day exercise ${id}`, () =>
    apiRequest(`/gym/plans/day-exercises/${id}`, { method: 'DELETE' }),
  );

export const reorderDayExercises = async (dayId, exerciseIds) =>
  withErrorContext('Error reordering exercises', () =>
    apiRequest(`/gym/plans/days/${dayId}/reorder`, {
      method: 'POST',
      body: { exercise_ids: exerciseIds },
    }),
  );

// ============================================================================
// API Functions - Assignments
// ============================================================================

export const getActiveAssignment = async () =>
  withErrorContext('Error fetching active assignment', async () => {
    const data = await apiRequest('/gym/assignments');
    return data ? transformPlanAssignment(data) : null;
  });

export const createAssignment = async (planId) =>
  withErrorContext('Error creating assignment', () =>
    apiRequest('/gym/assignments', {
      method: 'POST',
      body: { plan_id: planId },
    }),
  );

export const updateAssignment = async (id, updates) =>
  withErrorContext(`Error updating assignment ${id}`, () =>
    apiRequest(`/gym/assignments/${id}`, {
      method: 'PUT',
      body: {
        is_active: updates.isActive,
        current_week: updates.currentWeek,
      },
    }),
  );

// ============================================================================
// API Functions - Sessions
// ============================================================================

export const getAllSessions = async (filters = {}) =>
  withErrorContext('Error fetching workout sessions', async () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const data = await apiRequest(`/gym/sessions${queryString ? `?${queryString}` : ''}`);
    return data.map(transformWorkoutSession);
  });

export const getSession = async (id) =>
  withErrorContext(`Error fetching workout session ${id}`, async () => {
    const data = await apiRequest(`/gym/sessions/${id}`);
    return transformWorkoutSessionWithExercises(data);
  });

export const createSession = async (session) =>
  withErrorContext('Error creating workout session', () =>
    apiRequest('/gym/sessions', {
      method: 'POST',
      body: transformSessionToBackend(session),
    }),
  );

export const updateSession = async (id, session) =>
  withErrorContext(`Error updating workout session ${id}`, () =>
    apiRequest(`/gym/sessions/${id}`, {
      method: 'PUT',
      body: transformSessionUpdateToBackend(session),
    }),
  );

export const deleteSession = async (id) =>
  withErrorContext(`Error deleting workout session ${id}`, () =>
    apiRequest(`/gym/sessions/${id}`, { method: 'DELETE' }),
  );

export const addSessionExercise = async (sessionId, exerciseId, sortOrder = 0) =>
  withErrorContext('Error adding exercise to session', () =>
    apiRequest(`/gym/sessions/${sessionId}/exercises`, {
      method: 'POST',
      body: { exercise_id: exerciseId, sort_order: sortOrder },
    }),
  );

export const addSessionSet = async (sessionExerciseId, set) =>
  withErrorContext('Error logging set', () =>
    apiRequest(`/gym/sessions/exercises/${sessionExerciseId}/sets`, {
      method: 'POST',
      body: transformSessionSetToBackend(set),
    }),
  );

export const updateSessionSet = async (id, set) =>
  withErrorContext(`Error updating set ${id}`, () =>
    apiRequest(`/gym/sessions/sets/${id}`, {
      method: 'PUT',
      body: transformSessionSetToBackend(set),
    }),
  );

export const deleteSessionSet = async (id) =>
  withErrorContext(`Error deleting set ${id}`, () =>
    apiRequest(`/gym/sessions/sets/${id}`, { method: 'DELETE' }),
  );

// ============================================================================
// API Functions - Bodyweight
// ============================================================================

export const getBodyweightLogs = async (filters = {}) =>
  withErrorContext('Error fetching bodyweight logs', async () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const data = await apiRequest(`/gym/bodyweight${queryString ? `?${queryString}` : ''}`);
    return data.map(transformBodyweightLog);
  });

export const createBodyweightLog = async (log) =>
  withErrorContext('Error logging bodyweight', () =>
    apiRequest('/gym/bodyweight', {
      method: 'POST',
      body: transformBodyweightToBackend(log),
    }),
  );

export const updateBodyweightLog = async (id, log) =>
  withErrorContext(`Error updating bodyweight log ${id}`, () =>
    apiRequest(`/gym/bodyweight/${id}`, {
      method: 'PUT',
      body: {
        weight: toOptionalNumber(log.weight),
        body_fat_percent: toOptionalNumber(log.bodyFatPercent),
        notes: toOptionalString(log.notes),
      },
    }),
  );

export const deleteBodyweightLog = async (id) =>
  withErrorContext(`Error deleting bodyweight log ${id}`, () =>
    apiRequest(`/gym/bodyweight/${id}`, { method: 'DELETE' }),
  );

// ============================================================================
// API Functions - Stretch Logs
// ============================================================================

export const getStretchLogs = async (filters = {}) =>
  withErrorContext('Error fetching stretch logs', async () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const data = await apiRequest(`/gym/stretch-logs${queryString ? `?${queryString}` : ''}`);
    return data.map(transformStretchLog);
  });

export const createStretchLog = async (log) =>
  withErrorContext('Error creating stretch log', () =>
    apiRequest('/gym/stretch-logs', {
      method: 'POST',
      body: transformStretchLogToBackend(log),
    }),
  );

export const deleteStretchLog = async (id) =>
  withErrorContext(`Error deleting stretch log ${id}`, () =>
    apiRequest(`/gym/stretch-logs/${id}`, { method: 'DELETE' }),
  );

// ============================================================================
// API Functions - Analytics
// ============================================================================

export const getAnalytics = async () =>
  withErrorContext('Error fetching gym analytics', async () => {
    const data = await apiRequest('/gym/analytics');
    return transformAnalytics(data);
  });

export const getExerciseAnalytics = async (exerciseId) =>
  withErrorContext(`Error fetching exercise analytics ${exerciseId}`, async () => {
    const data = await apiRequest(`/gym/analytics/exercise/${exerciseId}`);
    return transformExerciseAnalytics(data);
  });

// ============================================================================
// API Functions - Seed
// ============================================================================

export const seedGymData = async () =>
  withErrorContext('Error seeding gym data', () =>
    apiRequest('/gym/seed', { method: 'POST' }),
  );
