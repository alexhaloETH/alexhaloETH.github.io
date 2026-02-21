import { getAuthHeaders, getAuthHeadersOnly } from './auth';

export const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_BASE_URL = `${API_ROOT}/api`;

const buildHeaders = ({ useAuth, hasBody }) => {
  if (!useAuth) {
    return hasBody ? { 'Content-Type': 'application/json' } : {};
  }

  return hasBody ? getAuthHeaders() : getAuthHeadersOnly();
};

const parsePayload = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const toErrorMessage = (payload, status) => {
  if (payload && typeof payload === 'object') {
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  return `HTTP error! status: ${status}`;
};

export const apiRequest = async (
  path,
  {
    method = 'GET',
    body,
    useAuth = true,
    baseUrl = API_BASE_URL,
  } = {},
) => {
  const hasBody = body !== undefined;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: buildHeaders({ useAuth, hasBody }),
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, response.status));
  }

  return payload;
};

export const withErrorContext = async (message, request) => {
  try {
    return await request();
  } catch (error) {
    console.error(`${message}:`, error);
    throw error;
  }
};
