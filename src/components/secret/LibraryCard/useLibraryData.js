import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createLibraryBook as createLibraryBookApi,
  createReadingSession as createReadingSessionApi,
  deleteLibraryBook as deleteLibraryBookApi,
  getAllLibraryBooks,
  getAllReadingSessions,
  updateLibraryBook as updateLibraryBookApi,
} from '../../../utils/libraryApi';

const STATUS_PRIORITY = {
  reading: 0,
  backlog: 1,
  paused: 2,
  finished: 3,
  dnf: 4,
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isWithinLastDays = (value, days) => {
  const date = parseDate(value);
  if (!date) {
    return false;
  }

  const today = parseDate(getTodayDateString());
  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() - (days - 1));
  return date >= earliest && date <= today;
};

const getReadingStreak = (sessions) => {
  const readingDates = new Set(
    sessions
      .filter((session) => session.pagesRead > 0)
      .map((session) => session.sessionDate),
  );

  if (!readingDates.size) {
    return 0;
  }

  const today = parseDate(getTodayDateString());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let cursor = null;
  if (readingDates.has(toDateString(today))) {
    cursor = today;
  } else if (readingDates.has(toDateString(yesterday))) {
    cursor = yesterday;
  }

  if (!cursor) {
    return 0;
  }

  let streak = 0;
  while (readingDates.has(toDateString(cursor))) {
    streak += 1;
    const previous = new Date(cursor);
    previous.setDate(previous.getDate() - 1);
    cursor = previous;
  }

  return streak;
};

const compareTextTimestamps = (left = '', right = '') => right.localeCompare(left);

const getBookSortValue = (book) => (
  book.lastSession?.sessionDate
  || book.updatedAt
  || book.createdAt
  || ''
);

function useLibraryData(showNotification, { canReadLibrary = true, canWriteLibrary = true } = {}) {
  const [books, setBooks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showLogSessionModal, setShowLogSessionModal] = useState(false);
  const [selectedSessionBook, setSelectedSessionBook] = useState(null);

  const refreshLibrary = useCallback(async () => {
    if (!canReadLibrary) {
      setBooks([]);
      setSessions([]);
      return;
    }

    const [fetchedBooks, fetchedSessions] = await Promise.all([
      getAllLibraryBooks(),
      getAllReadingSessions(),
    ]);

    setBooks(fetchedBooks);
    setSessions(fetchedSessions);
  }, [canReadLibrary]);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setIsLoading(true);
        await refreshLibrary();
      } catch (error) {
        console.error('Failed to load library tracker:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to load library tracker data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLibrary();
  }, [refreshLibrary, showNotification]);

  const sortedSessions = useMemo(() => (
    [...sessions].sort((left, right) => {
      const dateDiff = compareTextTimestamps(left.sessionDate, right.sessionDate);
      if (dateDiff !== 0) {
        return dateDiff;
      }

      return compareTextTimestamps(left.createdAt, right.createdAt);
    })
  ), [sessions]);

  const sessionsByBook = useMemo(() => {
    const map = new Map();
    sortedSessions.forEach((session) => {
      const existing = map.get(session.bookId);
      if (existing) {
        existing.push(session);
      } else {
        map.set(session.bookId, [session]);
      }
    });
    return map;
  }, [sortedSessions]);

  const bookMap = useMemo(() => (
    new Map(books.map((book) => [book.id, book]))
  ), [books]);

  const recentSessions = useMemo(() => (
    sortedSessions.slice(0, 6).map((session) => ({
      ...session,
      book: bookMap.get(session.bookId) || null,
    }))
  ), [bookMap, sortedSessions]);

  const enrichedBooks = useMemo(() => {
    const today = getTodayDateString();

    return books
      .map((book) => {
        const bookSessions = sessionsByBook.get(book.id) || [];
        const pagesToday = bookSessions
          .filter((session) => session.sessionDate === today)
          .reduce((total, session) => total + session.pagesRead, 0);
        const lastSession = bookSessions[0] || null;
        const remainingPages = typeof book.totalPages === 'number'
          ? Math.max(book.totalPages - book.currentPage, 0)
          : null;
        const progressPercent = typeof book.totalPages === 'number' && book.totalPages > 0
          ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
          : null;
        const goalRemaining = typeof book.dailyGoalPages === 'number'
          ? Math.max(book.dailyGoalPages - pagesToday, 0)
          : null;

        return {
          ...book,
          lastSession,
          pagesToday,
          progressPercent,
          remainingPages,
          goalRemaining,
        };
      })
      .sort((left, right) => {
        const leftPriority = STATUS_PRIORITY[left.status] ?? 99;
        const rightPriority = STATUS_PRIORITY[right.status] ?? 99;
        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        const activityDiff = compareTextTimestamps(getBookSortValue(left), getBookSortValue(right));
        if (activityDiff !== 0) {
          return activityDiff;
        }

        return left.title.localeCompare(right.title);
      });
  }, [books, sessionsByBook]);

  const stats = useMemo(() => ({
    totalBooks: books.length,
    readingBooks: books.filter((book) => book.status === 'reading').length,
    finishedBooks: books.filter((book) => book.status === 'finished').length,
    pagesToday: sortedSessions
      .filter((session) => session.sessionDate === getTodayDateString())
      .reduce((total, session) => total + session.pagesRead, 0),
    pagesThisWeek: sortedSessions
      .filter((session) => isWithinLastDays(session.sessionDate, 7))
      .reduce((total, session) => total + session.pagesRead, 0),
    streak: getReadingStreak(sortedSessions),
  }), [books, sortedSessions]);

  const openLogSessionModal = useCallback((book = null) => {
    setSelectedSessionBook(book);
    setShowLogSessionModal(true);
  }, []);

  const closeLogSessionModal = useCallback(() => {
    setShowLogSessionModal(false);
    setSelectedSessionBook(null);
  }, []);

  const addBook = async (book) => {
    if (!canWriteLibrary) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to add books',
        type: 'error',
      });
      return false;
    }

    try {
      await createLibraryBookApi(book);
      await refreshLibrary();
      setShowAddBookModal(false);
      showNotification({
        title: 'Saved',
        message: `${book.title} added to the library`,
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to add book:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to add book',
        type: 'error',
      });
      return false;
    }
  };

  const updateBook = async (book) => {
    if (!canWriteLibrary) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to update books',
        type: 'error',
      });
      return false;
    }

    try {
      await updateLibraryBookApi(book.id, book);
      await refreshLibrary();
      setEditingBook(null);
      showNotification({
        title: 'Updated',
        message: `${book.title} was updated`,
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to update book:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to update book',
        type: 'error',
      });
      return false;
    }
  };

  const deleteBook = async (id) => {
    if (!canWriteLibrary) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to delete books',
        type: 'error',
      });
      return false;
    }

    const book = books.find((item) => item.id === id);

    try {
      await deleteLibraryBookApi(id);
      await refreshLibrary();
      setEditingBook(null);
      showNotification({
        title: 'Deleted',
        message: book ? `${book.title} removed from the library` : 'Book removed',
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete book:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to delete book',
        type: 'error',
      });
      return false;
    }
  };

  const addSession = async (session) => {
    if (!canWriteLibrary) {
      showNotification({
        title: 'Access denied',
        message: 'You do not have permission to log reading sessions',
        type: 'error',
      });
      return false;
    }

    const book = books.find((item) => item.id === session.bookId);
    const pagesRead = Math.max(0, session.endPage - session.startPage);

    try {
      await createReadingSessionApi(session);
      await refreshLibrary();
      closeLogSessionModal();
      showNotification({
        title: 'Session logged',
        message: pagesRead > 0
          ? `${pagesRead} pages logged${book ? ` for ${book.title}` : ''}`
          : `Reading note saved${book ? ` for ${book.title}` : ''}`,
        type: 'success',
      });
      return true;
    } catch (error) {
      console.error('Failed to log reading session:', error);
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to log reading session',
        type: 'error',
      });
      return false;
    }
  };

  return {
    books: enrichedBooks,
    recentSessions,
    stats,
    isLoading,
    editingBook,
    setEditingBook,
    showAddBookModal,
    setShowAddBookModal,
    showLogSessionModal,
    openLogSessionModal,
    closeLogSessionModal,
    selectedSessionBook,
    addBook,
    updateBook,
    deleteBook,
    addSession,
  };
}

export default useLibraryData;
