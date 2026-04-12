import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAllExercises,
  getAllStretches,
  getAllPlans,
  getPlan,
  getActiveAssignment,
  createAssignment,
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  addSessionExercise,
  addSessionSet,
  getBodyweightLogs,
  createBodyweightLog,
  deleteBodyweightLog,
  getStretchLogs,
  createStretchLog,
  getAnalytics,
  seedGymData,
} from '../../../utils/gymApi';

const getTodayDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getCurrentDayOfWeek = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day; // Convert Sunday from 0 to 7
};

function useGymData(showNotification, { canReadGym = true, canWriteGym = true } = {}) {
  const [exercises, setExercises] = useState([]);
  const [stretches, setStretches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [bodyweightLogs, setBodyweightLogs] = useState([]);
  const [stretchLogs, setStretchLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const refreshData = useCallback(async () => {
    if (!canReadGym) {
      setExercises([]);
      setStretches([]);
      setPlans([]);
      setActivePlan(null);
      setActiveAssignment(null);
      setSessions([]);
      setBodyweightLogs([]);
      setStretchLogs([]);
      setAnalytics(null);
      return;
    }

    try {
      const [
        exercisesData,
        stretchesData,
        plansData,
        assignmentData,
        sessionsData,
        bodyweightData,
        stretchLogsData,
        analyticsData,
      ] = await Promise.all([
        getAllExercises(),
        getAllStretches(),
        getAllPlans(),
        getActiveAssignment(),
        getAllSessions({ limit: 30 }),
        getBodyweightLogs({ limit: 90 }),
        getStretchLogs({ limit: 30 }),
        getAnalytics(),
      ]);

      setExercises(exercisesData);
      setStretches(stretchesData);
      setPlans(plansData);
      setActiveAssignment(assignmentData);
      setSessions(sessionsData);
      setBodyweightLogs(bodyweightData);
      setStretchLogs(stretchLogsData);
      setAnalytics(analyticsData);

      // Load full plan details if assigned
      if (assignmentData?.planId) {
        const fullPlan = await getPlan(assignmentData.planId);
        setActivePlan(fullPlan);
      }
    } catch (error) {
      console.error('Failed to load gym data:', error);
      throw error;
    }
  }, [canReadGym]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await refreshData();
      } catch {
        showNotification({
          title: 'Error',
          message: 'Failed to load gym data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [refreshData, showNotification]);

  // Get today's workout from the active plan
  const todaysWorkout = useMemo(() => {
    if (!activePlan?.days) return null;
    const today = getCurrentDayOfWeek();
    return activePlan.days.find((day) => day.dayNumber === today) || null;
  }, [activePlan]);

  // Check if there's already a session for today
  const todaysSession = useMemo(() => {
    const today = getTodayDateString();
    return sessions.find((s) => s.sessionDate === today) || null;
  }, [sessions]);

  // Stats computed from data
  const stats = useMemo(() => ({
    workoutStreak: analytics?.workoutStreak || 0,
    workoutsThisWeek: analytics?.workoutsThisWeek || 0,
    workoutsThisMonth: analytics?.workoutsThisMonth || 0,
    totalWorkouts: analytics?.totalWorkouts || 0,
    totalVolumeThisWeek: analytics?.totalVolumeThisWeek || 0,
    recentBodyweight: analytics?.recentBodyweight,
    bodyweightChange30d: analytics?.bodyweightChange30d,
    personalRecords: analytics?.personalRecords || [],
  }), [analytics]);

  // Group stretches by recommended use
  const stretchesByUse = useMemo(() => {
    const groups = {
      pre_workout: [],
      post_upper: [],
      post_lower: [],
      rest_day: [],
      custom: [],
    };

    stretches.forEach((stretch) => {
      const use = stretch.recommendedUse || 'custom';
      if (groups[use]) {
        groups[use].push(stretch);
      } else {
        groups.custom.push(stretch);
      }
    });

    return groups;
  }, [stretches]);

  // Group exercises by category
  const exercisesByCategory = useMemo(() => {
    const groups = {};
    exercises.forEach((exercise) => {
      const category = exercise.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(exercise);
    });
    return groups;
  }, [exercises]);

  // Seed gym data
  const runSeed = async () => {
    if (!canWriteGym) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to seed gym data',
        type: 'error',
      });
      return false;
    }

    try {
      setIsSeeding(true);
      await seedGymData();
      await refreshData();
      showNotification({
        title: 'Success',
        message: 'Gym data seeded successfully',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to seed gym data:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to seed gym data',
        type: 'error',
      });
      return false;
    } finally {
      setIsSeeding(false);
    }
  };

  // Assign a plan
  const assignPlan = async (planId) => {
    if (!canWriteGym) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to assign plans',
        type: 'error',
      });
      return false;
    }

    try {
      await createAssignment(planId);
      await refreshData();
      showNotification({
        title: 'Success',
        message: 'Plan assigned successfully',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to assign plan:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to assign plan',
        type: 'error',
      });
      return false;
    }
  };

  // Start a workout session
  const startWorkout = async (planDayId = null) => {
    if (!canWriteGym) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to start workouts',
        type: 'error',
      });
      return null;
    }

    try {
      const now = new Date();
      const result = await createSession({
        planDayId,
        sessionDate: getTodayDateString(),
        startedAt: now.toISOString(),
      });

      // Load the full session
      const session = await getSession(result.id);
      setActiveSession(session);
      await refreshData();

      showNotification({
        title: 'Workout started',
        message: 'Good luck with your workout!',
        type: 'success',
      });

      return session;
    } catch (error) {
      console.error('Failed to start workout:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to start workout',
        type: 'error',
      });
      return null;
    }
  };

  // Resume an existing session
  const resumeWorkout = async (sessionId) => {
    try {
      const session = await getSession(sessionId);
      setActiveSession(session);
      return session;
    } catch (error) {
      console.error('Failed to resume workout:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to resume workout',
        type: 'error',
      });
      return null;
    }
  };

  // Add exercise to session
  const addExerciseToSession = async (exerciseId) => {
    if (!activeSession) return null;

    try {
      const sortOrder = activeSession.exercises?.length || 0;
      const result = await addSessionExercise(activeSession.id, exerciseId, sortOrder);

      // Refresh active session
      const updated = await getSession(activeSession.id);
      setActiveSession(updated);

      return result;
    } catch (error) {
      console.error('Failed to add exercise:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to add exercise',
        type: 'error',
      });
      return null;
    }
  };

  // Log a set
  const logSet = async (sessionExerciseId, set) => {
    try {
      const result = await addSessionSet(sessionExerciseId, set);

      // Refresh active session
      if (activeSession) {
        const updated = await getSession(activeSession.id);
        setActiveSession(updated);
      }

      return result;
    } catch (error) {
      console.error('Failed to log set:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to log set',
        type: 'error',
      });
      return null;
    }
  };

  // Complete workout
  const completeWorkout = async (ratings = {}) => {
    if (!activeSession) return false;

    try {
      const now = new Date();
      const startTime = activeSession.startedAt
        ? new Date(activeSession.startedAt)
        : now;
      const durationMinutes = Math.round((now - startTime) / 60000);

      await updateSession(activeSession.id, {
        endedAt: now.toISOString(),
        durationMinutes,
        completed: true,
        energyRating: ratings.energy,
        workoutRating: ratings.workout,
        sorenessRating: ratings.soreness,
        notes: ratings.notes,
      });

      setActiveSession(null);
      await refreshData();

      showNotification({
        title: 'Workout complete',
        message: `Great work! ${durationMinutes} minutes logged.`,
        type: 'success',
      });

      return true;
    } catch (error) {
      console.error('Failed to complete workout:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to complete workout',
        type: 'error',
      });
      return false;
    }
  };

  // Log bodyweight
  const logBodyweight = async (data) => {
    if (!canWriteGym) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to log bodyweight',
        type: 'error',
      });
      return false;
    }

    try {
      await createBodyweightLog({
        logDate: data.logDate || getTodayDateString(),
        weight: data.weight,
        bodyFatPercent: data.bodyFatPercent,
        notes: data.notes,
      });
      await refreshData();
      showNotification({
        title: 'Logged',
        message: 'Bodyweight logged successfully',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to log bodyweight:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to log bodyweight',
        type: 'error',
      });
      return false;
    }
  };

  // Delete bodyweight log
  const removeBodyweightLog = async (id) => {
    if (!canWriteGym) return false;

    try {
      await deleteBodyweightLog(id);
      await refreshData();
      showNotification({
        title: 'Deleted',
        message: 'Bodyweight log removed',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete bodyweight log:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to delete',
        type: 'error',
      });
      return false;
    }
  };

  // Log stretch session
  const logStretchSession = async (data) => {
    if (!canWriteGym) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to log stretches',
        type: 'error',
      });
      return false;
    }

    try {
      await createStretchLog({
        logDate: data.logDate || getTodayDateString(),
        routineType: data.routineType,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        items: data.items,
      });
      await refreshData();
      showNotification({
        title: 'Logged',
        message: 'Stretch session logged',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to log stretch session:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to log stretch session',
        type: 'error',
      });
      return false;
    }
  };

  return {
    // Data
    exercises,
    exercisesByCategory,
    stretches,
    stretchesByUse,
    plans,
    activePlan,
    activeAssignment,
    sessions,
    activeSession,
    setActiveSession,
    bodyweightLogs,
    stretchLogs,
    analytics,
    stats,
    todaysWorkout,
    todaysSession,

    // State
    isLoading,
    isSeeding,

    // Actions
    refreshData,
    runSeed,
    assignPlan,
    startWorkout,
    resumeWorkout,
    addExerciseToSession,
    logSet,
    completeWorkout,
    logBodyweight,
    removeBodyweightLog,
    logStretchSession,
  };
}

export default useGymData;
