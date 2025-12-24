const API_BASE_URL = 'http://localhost:8080/api';

// Priority mapping: high=2, medium=1, low=0
const priorityToNumber = {
  'high': 2,
  'medium': 1,
  'low': 0,
};

const numberToPriority = {
  2: 'high',
  1: 'medium',
  0: 'low',
};

// Due date mapping: Today=0, Tomorrow=1, This week=2, Next week=3, etc.
const dueDateToNumber = {
  'Today': 0,
  'Tomorrow': 1,
  'This week': 2,
  'Next week': 3,
  'This month': 4,
  'No date': 5,
};

const numberToDueDate = {
  0: 'Today',
  1: 'Tomorrow',
  2: 'This week',
  3: 'Next week',
  4: 'This month',
  5: 'No date',
};

// Transform task from backend to frontend
const transformTaskItem = (backendItem) => {
  return {
    id: backendItem.id,
    text: backendItem.name,
    completed: backendItem.state,
    priority: numberToPriority[backendItem.priority] || 'low',
    dueDate: numberToDueDate[backendItem.due_date] || 'No date',
  };
};

// Transform task from frontend to backend
const transformToBackendFormat = (frontendItem) => {
  return {
    name: frontendItem.text || '',
    priority: priorityToNumber[frontendItem.priority] || 0,
    due_date: dueDateToNumber[frontendItem.dueDate] || 5,
    state: frontendItem.completed || false,
  };
};

// Get all tasks
export const getAllTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformTaskItem);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task
export const getTask = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return transformTaskItem(data);
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (task) => {
  try {
    const backendTask = transformToBackendFormat(task);
    console.log('Creating task:', { original: task, transformed: backendTask });

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendTask),
    });

    console.log('Create task response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Create task response data:', data);
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (id, updatedTask) => {
  try {
    const backendTask = transformToBackendFormat(updatedTask);
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendTask),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};
