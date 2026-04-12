import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_ROOT } from '../../utils/apiClient';
import { getAllPlants } from '../../utils/plantsApi';
import { getAllLibraryBooks, getAllReadingSessions } from '../../utils/libraryApi';
import { getAllTasks } from '../../utils/taskApi';
import { getAllMissions } from '../../utils/missionsApi';
import { getAllShoppingItems } from '../../utils/shoppingApi';
import { getSystemStatus } from '../../utils/systemApi';
import {
  getActiveAssignment,
  getAllExercises,
  getAllSessions,
  getAllStretches,
  getAnalytics,
  getPlan,
  getStretchLogs,
} from '../../utils/gymApi';
import {
  addDays,
  getCurrentDayNumber,
  getDaysBetween,
  getTodayDateString,
  parseDate,
} from '../piDisplayUtils';

const EMPTY_SECTION = {
  ok: false,
  error: null,
};

const INITIAL_DATA = {
  authMissing: false,
  lastUpdated: null,
  health: {
    apiOk: false,
    error: null,
  },
  system: {
    ...EMPTY_SECTION,
    cpuUsage: null,
    ramUsage: null,
    diskUsage: null,
    temperature: null,
    uptime: '',
  },
  garden: {
    ...EMPTY_SECTION,
    total: 0,
    needsWater: [],
    overduePlants: [],
    readyToHarvest: [],
    nextWaterPlant: null,
    nextHarvestPlant: null,
  },
  daily: {
    ...EMPTY_SECTION,
    openTasks: 0,
    highPriorityTask: null,
    dueTodayTasks: [],
    uncheckedShopping: 0,
    topMission: null,
  },
  library: {
    ...EMPTY_SECTION,
    pagesToday: 0,
    dailyGoal: null,
    currentBook: null,
    streak: 0,
  },
  gym: {
    ...EMPTY_SECTION,
    activeAssignment: null,
    activePlan: null,
    todaysWorkout: null,
    lastSession: null,
    analytics: null,
    exerciseCount: 0,
    stretchCount: 0,
    stretchLoggedToday: false,
  },
};

const safeCall = async (request, fallback) => {
  try {
    return {
      ok: true,
      value: await request(),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      value: fallback,
      error: error.message || 'Unavailable',
    };
  }
};

const fetchHealth = async () => {
  try {
    const response = await fetch(`${API_ROOT}/health`, {
      cache: 'no-store',
    });

    return {
      apiOk: response.ok,
      error: response.ok ? null : `Health check returned ${response.status}`,
    };
  } catch (error) {
    return {
      apiOk: false,
      error: error.message || 'Health check failed',
    };
  }
};

const buildGardenSummary = (plantsResult) => {
  const plants = Array.isArray(plantsResult.value) ? plantsResult.value : [];
  const today = parseDate(getTodayDateString());

  const enrichedPlants = plants.map((plant) => {
    const nextWaterDate = plant.wateringIntervalDays
      ? addDays(plant.lastWateredOn || plant.plantedOn, plant.wateringIntervalDays)
      : null;
    const daysUntilWater = getDaysBetween(nextWaterDate, today);
    const harvestStart = parseDate(plant.harvestStartOn);
    const harvestEnd = parseDate(plant.harvestEndOn);
    const readyToHarvest = Boolean(
      plant.isHarvestable
      && harvestStart
      && harvestStart <= today
      && (!harvestEnd || harvestEnd >= today),
    );

    return {
      ...plant,
      nextWaterDate,
      daysUntilWater,
      readyToHarvest,
    };
  });

  const needsWater = enrichedPlants.filter((plant) => (
    typeof plant.daysUntilWater === 'number' && plant.daysUntilWater <= 0
  ));
  const overduePlants = needsWater.filter((plant) => plant.daysUntilWater < 0);
  const futureWaterPlants = enrichedPlants
    .filter((plant) => typeof plant.daysUntilWater === 'number' && plant.daysUntilWater > 0)
    .sort((left, right) => left.daysUntilWater - right.daysUntilWater);
  const futureHarvestPlants = enrichedPlants
    .filter((plant) => plant.isHarvestable && plant.harvestStartOn && !plant.readyToHarvest)
    .sort((left, right) => plantDateSort(left.harvestStartOn, right.harvestStartOn));

  return {
    ok: plantsResult.ok,
    error: plantsResult.error,
    total: plants.length,
    needsWater,
    overduePlants,
    readyToHarvest: enrichedPlants.filter((plant) => plant.readyToHarvest),
    nextWaterPlant: needsWater[0] || futureWaterPlants[0] || null,
    nextHarvestPlant: enrichedPlants.find((plant) => plant.readyToHarvest) || futureHarvestPlants[0] || null,
  };
};

const plantDateSort = (leftValue, rightValue) => {
  const left = parseDate(leftValue);
  const right = parseDate(rightValue);
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  return left - right;
};

const getReadingStreak = (sessions) => {
  const readingDates = new Set(
    sessions
      .filter((session) => session.pagesRead > 0)
      .map((session) => session.sessionDate),
  );

  let cursor = parseDate(getTodayDateString());
  let streak = 0;

  while (cursor && readingDates.has(getDateKey(cursor))) {
    streak += 1;
    const previous = new Date(cursor);
    previous.setDate(previous.getDate() - 1);
    cursor = previous;
  }

  return streak;
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildLibrarySummary = (booksResult, sessionsResult) => {
  const books = Array.isArray(booksResult.value) ? booksResult.value : [];
  const sessions = Array.isArray(sessionsResult.value) ? sessionsResult.value : [];
  const today = getTodayDateString();
  const pagesToday = sessions
    .filter((session) => session.sessionDate === today)
    .reduce((total, session) => total + session.pagesRead, 0);
  const currentBook = books.find((book) => book.status === 'reading')
    || books.find((book) => book.status === 'backlog')
    || books[0]
    || null;

  return {
    ok: booksResult.ok && sessionsResult.ok,
    error: booksResult.error || sessionsResult.error,
    pagesToday,
    dailyGoal: currentBook?.dailyGoalPages ?? null,
    currentBook,
    streak: getReadingStreak(sessions),
  };
};

const buildDailySummary = (tasksResult, shoppingResult, missionsResult) => {
  const tasks = Array.isArray(tasksResult.value) ? tasksResult.value : [];
  const shopping = Array.isArray(shoppingResult.value) ? shoppingResult.value : [];
  const missions = Array.isArray(missionsResult.value) ? missionsResult.value : [];
  const openTasks = tasks.filter((task) => !task.completed);
  const dueTodayTasks = openTasks.filter((task) => task.dueDate === 'Today');
  const highPriorityTask = openTasks.find((task) => task.priority === 'high')
    || dueTodayTasks[0]
    || openTasks[0]
    || null;
  const topMission = missions.find((mission) => !mission.completed)
    || missions[0]
    || null;

  return {
    ok: tasksResult.ok || shoppingResult.ok || missionsResult.ok,
    error: tasksResult.error || shoppingResult.error || missionsResult.error,
    openTasks: openTasks.length,
    highPriorityTask,
    dueTodayTasks,
    uncheckedShopping: shopping.filter((item) => !item.checked).length,
    topMission,
  };
};

const buildSystemSummary = (systemResult) => {
  const status = systemResult.value || {};

  return {
    ok: systemResult.ok,
    error: systemResult.error,
    cpuUsage: typeof status.cpu_usage === 'number' ? status.cpu_usage : null,
    ramUsage: typeof status.ram_usage === 'number' ? status.ram_usage : null,
    diskUsage: typeof status.disk_usage === 'number' ? status.disk_usage : null,
    temperature: typeof status.temperature === 'number' ? status.temperature : null,
    uptime: status.uptime_formatted || '',
  };
};

const buildGymSummary = ({
  analyticsResult,
  assignmentResult,
  activePlanResult,
  sessionsResult,
  exercisesResult,
  stretchesResult,
  stretchLogsResult,
}) => {
  const activePlan = activePlanResult?.value || null;
  const todaysWorkout = activePlan?.days?.find((day) => day.dayNumber === getCurrentDayNumber()) || null;
  const sessions = Array.isArray(sessionsResult.value) ? sessionsResult.value : [];
  const stretchLogs = Array.isArray(stretchLogsResult.value) ? stretchLogsResult.value : [];
  const today = getTodayDateString();

  return {
    ok: analyticsResult.ok || assignmentResult.ok || exercisesResult.ok || stretchesResult.ok,
    error: analyticsResult.error || assignmentResult.error || exercisesResult.error || stretchesResult.error,
    activeAssignment: assignmentResult.value || null,
    activePlan,
    todaysWorkout,
    lastSession: sessions[0] || null,
    analytics: analyticsResult.value || null,
    exerciseCount: Array.isArray(exercisesResult.value) ? exercisesResult.value.length : 0,
    stretchCount: Array.isArray(stretchesResult.value) ? stretchesResult.value.length : 0,
    stretchLoggedToday: stretchLogs.some((log) => log.logDate === today),
  };
};

function usePiDisplayData({ authToken, refreshMs = 60000 } = {}) {
  const [data, setData] = useState(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetData = useCallback((nextData) => {
    if (isMountedRef.current) {
      setData(nextData);
    }
  }, []);

  const safeSetIsLoading = useCallback((nextIsLoading) => {
    if (isMountedRef.current) {
      setIsLoading(nextIsLoading);
    }
  }, []);

  const loadData = useCallback(async () => {
    const health = await fetchHealth();
    const hasToken = Boolean(authToken || localStorage.getItem('dashboard_token'));

    if (!hasToken) {
      safeSetData({
        ...INITIAL_DATA,
        authMissing: true,
        health,
        lastUpdated: new Date().toISOString(),
      });
      safeSetIsLoading(false);
      return;
    }

    safeSetIsLoading(true);

    const [
      plantsResult,
      booksResult,
      sessionsResult,
      tasksResult,
      shoppingResult,
      missionsResult,
      systemResult,
      analyticsResult,
      assignmentResult,
      gymSessionsResult,
      exercisesResult,
      stretchesResult,
      stretchLogsResult,
    ] = await Promise.all([
      safeCall(getAllPlants, []),
      safeCall(getAllLibraryBooks, []),
      safeCall(getAllReadingSessions, []),
      safeCall(getAllTasks, []),
      safeCall(getAllShoppingItems, []),
      safeCall(getAllMissions, []),
      safeCall(getSystemStatus, null),
      safeCall(getAnalytics, null),
      safeCall(getActiveAssignment, null),
      safeCall(() => getAllSessions({ limit: 3 }), []),
      safeCall(getAllExercises, []),
      safeCall(getAllStretches, []),
      safeCall(() => getStretchLogs({ limit: 7 }), []),
    ]);

    const activePlanResult = assignmentResult.value?.planId
      ? await safeCall(() => getPlan(assignmentResult.value.planId), null)
      : { ok: true, value: null, error: null };

    safeSetData({
      authMissing: false,
      health,
      lastUpdated: new Date().toISOString(),
      system: buildSystemSummary(systemResult),
      garden: buildGardenSummary(plantsResult),
      daily: buildDailySummary(tasksResult, shoppingResult, missionsResult),
      library: buildLibrarySummary(booksResult, sessionsResult),
      gym: buildGymSummary({
        analyticsResult,
        assignmentResult,
        activePlanResult,
        sessionsResult: gymSessionsResult,
        exercisesResult,
        stretchesResult,
        stretchLogsResult,
      }),
    });
    safeSetIsLoading(false);
  }, [authToken, safeSetData, safeSetIsLoading]);

  useEffect(() => {
    let isMounted = true;

    const guardedLoadData = async () => {
      try {
        await loadData();
      } catch (error) {
        if (isMounted) {
          safeSetData((current) => ({
            ...current,
            lastUpdated: new Date().toISOString(),
            health: {
              apiOk: false,
              error: error.message || 'Display refresh failed',
            },
          }));
          safeSetIsLoading(false);
        }
      }
    };

    guardedLoadData();
    const intervalId = setInterval(guardedLoadData, refreshMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [loadData, refreshMs, safeSetData, safeSetIsLoading]);

  return useMemo(() => ({
    data,
    isLoading,
    refresh: loadData,
  }), [data, isLoading, loadData]);
}

export default usePiDisplayData;
