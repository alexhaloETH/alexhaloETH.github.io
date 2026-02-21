import { apiRequest, withErrorContext } from './apiClient';

export const getSystemStatus = async () => withErrorContext('Failed to fetch system status', () => (
  apiRequest('/system/status')
));

export const executeTerminalCommand = async (command) => withErrorContext(
  'Failed to execute command',
  () => apiRequest('/system/terminal', {
    method: 'POST',
    body: { command },
  }),
);
