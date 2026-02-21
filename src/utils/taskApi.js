import { apiRequest, withErrorContext } from './apiClient';

const priorityToNumber = {
  high: 2,
  medium: 1,
  low: 0,
};

const numberToPriority = {
  2: 'high',
  1: 'medium',
  0: 'low',
};

const dueDateToNumber = {
  Today: 0,
  Tomorrow: 1,
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

const transformTaskItem = (backendItem) => ({
  id: backendItem.id,
  text: backendItem.name,
  completed: backendItem.state,
  priority: numberToPriority[backendItem.priority] || 'low',
  dueDate: numberToDueDate[backendItem.due_date] || 'No date',
});

const transformToBackendFormat = (frontendItem) => ({
  name: frontendItem.text || '',
  priority: priorityToNumber[frontendItem.priority] || 0,
  due_date: dueDateToNumber[frontendItem.dueDate] || 5,
  state: frontendItem.completed || false,
});

export const getAllTasks = async () => withErrorContext('Error fetching tasks', async () => {
  const data = await apiRequest('/tasks');
  return data.map(transformTaskItem);
});

export const getTask = async (id) => withErrorContext(`Error fetching task ${id}`, async () => {
  const data = await apiRequest(`/tasks/${id}`);
  return transformTaskItem(data);
});

export const createTask = async (task) => withErrorContext('Error creating task', () => {
  const backendTask = transformToBackendFormat(task);
  return apiRequest('/tasks', {
    method: 'POST',
    body: backendTask,
  });
});

export const updateTask = async (id, updatedTask) => withErrorContext(`Error updating task ${id}`, () => {
  const backendTask = transformToBackendFormat(updatedTask);
  return apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: backendTask,
  });
});

export const deleteTask = async (id) => withErrorContext(`Error deleting task ${id}`, () => (
  apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  })
));
