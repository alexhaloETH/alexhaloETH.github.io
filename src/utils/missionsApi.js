import { getAuthHeaders, getAuthHeadersOnly } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Transform mission from backend to frontend format
const transformMission = (backendMission) => {
  return {
    id: backendMission.id,
    name: backendMission.name,
    description: backendMission.description || '',
    recurrenceType: backendMission.recurrence_type,
    completed: backendMission.completed,
    lastCompletedAt: backendMission.last_completed_at,
    nextResetAt: backendMission.next_reset_at,
    createdAt: backendMission.created_at,
  };
};

// Transform mission from frontend to backend format
const transformToBackendFormat = (frontendMission) => {
  return {
    name: frontendMission.name,
    description: frontendMission.description || null,
    recurrence_type: frontendMission.recurrenceType,
  };
};

export const getAllMissions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/missions`, {
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformMission);
  } catch (error) {
    console.error('Error fetching missions:', error);
    throw error;
  }
};

export const getMission = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return transformMission(data);
  } catch (error) {
    console.error(`Error fetching mission ${id}:`, error);
    throw error;
  }
};

export const createMission = async (mission) => {
  try {
    const backendMission = transformToBackendFormat(mission);
    const response = await fetch(`${API_BASE_URL}/missions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendMission),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw error;
  }
};

export const updateMission = async (id, updatedMission) => {
  try {
    const backendMission = transformToBackendFormat(updatedMission);
    const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendMission),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating mission ${id}:`, error);
    throw error;
  }
};

export const completeMission = async (id, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}/complete`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error completing mission ${id}:`, error);
    throw error;
  }
};

export const deleteMission = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeadersOnly(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting mission ${id}:`, error);
    throw error;
  }
};
