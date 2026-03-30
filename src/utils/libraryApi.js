import { apiRequest, withErrorContext } from './apiClient';

const normalizeString = (value) => (typeof value === 'string' ? value : '');

const toOptionalString = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toOptionalInteger = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, Math.floor(parsed));
};

const transformBook = (book) => ({
  id: book.id,
  title: normalizeString(book.title),
  author: normalizeString(book.author),
  format: normalizeString(book.format),
  totalPages: typeof book.total_pages === 'number' ? book.total_pages : null,
  currentPage: Number(book.current_page) || 0,
  dailyGoalPages: typeof book.daily_goal_pages === 'number' ? book.daily_goal_pages : null,
  status: normalizeString(book.status) || 'backlog',
  startedOn: normalizeString(book.started_on),
  finishedOn: normalizeString(book.finished_on),
  notes: normalizeString(book.notes),
  createdAt: normalizeString(book.created_at),
  updatedAt: normalizeString(book.updated_at),
});

const transformBookToBackend = (book) => ({
  title: book.title.trim(),
  author: toOptionalString(book.author),
  format: toOptionalString(book.format),
  total_pages: toOptionalInteger(book.totalPages),
  current_page: Math.max(0, Number(book.currentPage) || 0),
  daily_goal_pages: toOptionalInteger(book.dailyGoalPages),
  status: book.status || 'backlog',
  started_on: toOptionalString(book.startedOn),
  finished_on: toOptionalString(book.finishedOn),
  notes: toOptionalString(book.notes),
});

const transformSession = (session) => ({
  id: session.id,
  bookId: session.book_id,
  sessionDate: normalizeString(session.session_date),
  startPage: Number(session.start_page) || 0,
  endPage: Number(session.end_page) || 0,
  pagesRead: Number(session.pages_read) || 0,
  notes: normalizeString(session.notes),
  createdAt: normalizeString(session.created_at),
});

const transformSessionToBackend = (session) => ({
  book_id: Number(session.bookId),
  session_date: session.sessionDate,
  start_page: Math.max(0, Number(session.startPage) || 0),
  end_page: Math.max(0, Number(session.endPage) || 0),
  notes: toOptionalString(session.notes),
});

export const getAllLibraryBooks = async () => withErrorContext(
  'Error fetching library books',
  async () => {
    const data = await apiRequest('/library/books');
    return data.map(transformBook);
  },
);

export const createLibraryBook = async (book) => withErrorContext(
  'Error creating library book',
  () => apiRequest('/library/books', {
    method: 'POST',
    body: transformBookToBackend(book),
  }),
);

export const updateLibraryBook = async (id, book) => withErrorContext(
  `Error updating library book ${id}`,
  () => apiRequest(`/library/books/${id}`, {
    method: 'PUT',
    body: transformBookToBackend(book),
  }),
);

export const deleteLibraryBook = async (id) => withErrorContext(
  `Error deleting library book ${id}`,
  () => apiRequest(`/library/books/${id}`, {
    method: 'DELETE',
  }),
);

export const getAllReadingSessions = async () => withErrorContext(
  'Error fetching reading sessions',
  async () => {
    const data = await apiRequest('/library/sessions');
    return data.map(transformSession);
  },
);

export const createReadingSession = async (session) => withErrorContext(
  'Error creating reading session',
  () => apiRequest('/library/sessions', {
    method: 'POST',
    body: transformSessionToBackend(session),
  }),
);
