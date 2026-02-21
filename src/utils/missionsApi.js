import { apiRequest, withErrorContext } from './apiClient';

const transformMission = (backendMission) => ({
  id: backendMission.id,
  name: backendMission.name,
  description: backendMission.description || '',
  recurrenceType: backendMission.recurrence_type,
  missionType: backendMission.mission_type || 'streak',
  targetAmount: backendMission.target_amount ?? null,
  unit: backendMission.unit || '',
  completed: backendMission.completed,
  lastCompletedAt: backendMission.last_completed_at,
  nextResetAt: backendMission.next_reset_at,
  createdAt: backendMission.created_at,
  currentStreak: backendMission.current_streak ?? 0,
  bestStreak: backendMission.best_streak ?? 0,
  totalCompletions: backendMission.total_completions ?? 0,
  currentAmount: backendMission.current_amount ?? null,
  bestAmount: backendMission.best_amount ?? null,
  totalAmount: backendMission.total_amount ?? null,
  averageAmount: backendMission.average_amount ?? null,
  recentPeriods: (backendMission.recent_periods || []).map((period) => ({
    periodStart: period.period_start,
    periodEnd: period.period_end,
    completed: period.completed,
    isCurrent: period.is_current,
  })),
  recentAmounts: (backendMission.recent_amounts || []).map((period) => ({
    periodStart: period.period_start,
    periodEnd: period.period_end,
    amount: period.amount ?? null,
    isCurrent: period.is_current,
  })),
});

const transformToBackendFormat = (frontendMission) => ({
  name: frontendMission.name,
  description: frontendMission.description || null,
  recurrence_type: frontendMission.recurrenceType,
  mission_type: frontendMission.missionType || 'streak',
  target_amount: frontendMission.targetAmount ?? null,
  unit: frontendMission.unit?.trim() || null,
});

export const getAllMissions = async () => withErrorContext('Error fetching missions', async () => {
  const data = await apiRequest('/missions');
  return data.map(transformMission);
});

export const getMission = async (id) => withErrorContext(`Error fetching mission ${id}`, async () => {
  const data = await apiRequest(`/missions/${id}`);
  return transformMission(data);
});

export const createMission = async (mission) => withErrorContext('Error creating mission', () => {
  const backendMission = transformToBackendFormat(mission);
  return apiRequest('/missions', {
    method: 'POST',
    body: backendMission,
  });
});

export const updateMission = async (id, updatedMission) => withErrorContext(
  `Error updating mission ${id}`,
  () => {
    const backendMission = transformToBackendFormat(updatedMission);
    return apiRequest(`/missions/${id}`, {
      method: 'PUT',
      body: backendMission,
    });
  },
);

export const completeMission = async (id, completed) => withErrorContext(
  `Error completing mission ${id}`,
  async () => {
    const data = await apiRequest(`/missions/${id}/complete`, {
      method: 'PATCH',
      body: { completed },
    });
    return transformMission(data);
  },
);

export const logMissionAmount = async (id, amount) => withErrorContext(
  `Error logging mission amount ${id}`,
  async () => {
    const data = await apiRequest(`/missions/${id}/amount`, {
      method: 'PATCH',
      body: { amount },
    });
    return transformMission(data);
  },
);

export const deleteMission = async (id) => withErrorContext(`Error deleting mission ${id}`, () => (
  apiRequest(`/missions/${id}`, {
    method: 'DELETE',
  })
));
