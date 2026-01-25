const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthToken = () => {
  return localStorage.getItem('dashboard_token');
};

export const getSystemStatus = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/system/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch system status');
  }

  return response.json();
};

export const executeTerminalCommand = async (command) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/system/terminal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body:  JSON.stringify({ command }),
  });

  if (!response.ok) {
    throw new Error('Failed to execute command');
  }

  return response.json();
};
