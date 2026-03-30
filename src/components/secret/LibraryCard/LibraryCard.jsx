import { AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { useNotification } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import BookModal from './components/BookModal';
import ReadingSessionModal from './components/ReadingSessionModal';
import useLibraryData from './useLibraryData';
import './LibraryCard.css';

const STATUS_LABELS = {
  backlog: 'Backlog',
  reading: 'Reading',
  paused: 'Paused',
  finished: 'Finished',
  dnf: 'DNF',
};

const pluralize = (value, singular, plural = `${singular}s`) => (
  `${value} ${value === 1 ? singular : plural}`
);

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const getGoalLabel = (book) => {
  if (typeof book.dailyGoalPages !== 'number') {
    return 'No goal';
  }

  if (book.pagesToday >= book.dailyGoalPages) {
    return 'Hit today';
  }

  if (book.pagesToday > 0) {
    return `${book.goalRemaining} left`;
  }

  return `${book.dailyGoalPages}/day`;
};

const getInsight = (book) => {
  if (book.status === 'finished') {
    return book.finishedOn ? `Finished on ${formatDate(book.finishedOn)}` : 'Book completed';
  }

  if (book.pagesToday > 0) {
    return `${pluralize(book.pagesToday, 'page')} logged today`;
  }

  if (book.lastSession) {
    return `Last session on ${formatDate(book.lastSession.sessionDate)}`;
  }

  if (book.currentPage > 0) {
    return `Resume from page ${book.currentPage}`;
  }

  return 'Ready for the first session';
};

function LibraryCard() {
  const { showNotification } = useNotification();
  const { canWrite } = useAuth();
  const canWriteLibrary = canWrite('library');
  const {
    books,
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
  } = useLibraryData(showNotification, {
    canReadLibrary: true,
    canWriteLibrary,
  });

  const subtitle = stats.pagesToday > 0
    ? `${pluralize(stats.pagesToday, 'page')} read today`
    : stats.readingBooks > 0
      ? `${pluralize(stats.readingBooks, 'book')} currently in progress`
      : 'Track books, notes, and daily reading pace';

  return (
    <BaseCard className="card secret-card library-card">
      <div className="card-header library-card-header">
        <div className="library-title-block">
          <div className="card-icon library">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v18H7.5A2.5 2.5 0 0 0 5 22V4.5Z" />
              <path d="M5 18a2.5 2.5 0 0 1 2.5-2H20" />
              <path d="M9 6h7" />
              <path d="M9 10h7" />
            </svg>
          </div>
          <div>
            <h3>The Library</h3>
            <p className="library-subtitle">{subtitle}</p>
          </div>
        </div>

        {canWriteLibrary && (
          <div className="library-header-actions">
            <button
              type="button"
              className="library-secondary-btn"
              onClick={() => openLogSessionModal()}
              disabled={books.length === 0}
            >
              Log reading
            </button>
            <button
              type="button"
              className="library-primary-btn"
              onClick={() => setShowAddBookModal(true)}
            >
              Add book
            </button>
          </div>
        )}
      </div>

      <div className="library-stats">
        <div className="library-stat">
          <span className="library-stat-label">Pages today</span>
          <strong>{stats.pagesToday}</strong>
        </div>
        <div className="library-stat">
          <span className="library-stat-label">Pages this week</span>
          <strong>{stats.pagesThisWeek}</strong>
        </div>
        <div className="library-stat">
          <span className="library-stat-label">In progress</span>
          <strong>{stats.readingBooks}</strong>
        </div>
        <div className="library-stat">
          <span className="library-stat-label">Reading streak</span>
          <strong>{stats.streak}</strong>
        </div>
      </div>

      <div className="card-content library-content">
        {isLoading && (
          <div className="library-empty-state">
            <p>Loading library tracker...</p>
          </div>
        )}

        {!isLoading && books.length === 0 && (
          <div className="library-empty-state">
            <h4>No books tracked yet</h4>
            <p>
              Add what you are reading, keep the current page updated, save notes, and track how
              many pages you actually get through each day.
            </p>
            {canWriteLibrary && (
              <button
                type="button"
                className="library-primary-btn"
                onClick={() => setShowAddBookModal(true)}
              >
                Add the first book
              </button>
            )}
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <div className="library-body">
            <div className="library-list">
              {books.map((book) => (
                <article
                  key={book.id}
                  className={[
                    'library-item',
                    `status-${book.status}`,
                  ].join(' ')}
                >
                  <div className="library-item-top">
                    <div>
                      <h4>{book.title}</h4>
                      <p className="library-item-meta">
                        {[book.author, book.format].filter(Boolean).join(' • ') || 'Library entry'}
                      </p>
                    </div>

                    <div className="library-badges">
                      <span className={`library-pill ${book.progressPercent === null ? 'muted' : ''}`}>
                        {book.progressPercent === null ? 'Open-ended' : `${book.progressPercent}% complete`}
                      </span>
                      <span className={`library-status ${book.status}`}>
                        {STATUS_LABELS[book.status] || book.status}
                      </span>
                    </div>
                  </div>

                  <div className="library-progress-block">
                    <div className={`library-progress-bar ${book.progressPercent === null ? 'indeterminate' : ''}`}>
                      <span style={{ width: `${book.progressPercent ?? 32}%` }} />
                    </div>
                    <div className="library-progress-meta">
                      <span>
                        {typeof book.totalPages === 'number'
                          ? `${book.currentPage} / ${book.totalPages} pages`
                          : `Current page ${book.currentPage}`}
                      </span>
                      <strong>
                        {book.remainingPages !== null
                          ? `${pluralize(book.remainingPages, 'page')} left`
                          : 'Total pages not set'}
                      </strong>
                    </div>
                  </div>

                  <div className="library-details-grid">
                    <div className="library-detail-card">
                      <span>Pages today</span>
                      <strong>{book.pagesToday}</strong>
                    </div>
                    <div className="library-detail-card">
                      <span>Daily goal</span>
                      <strong>{getGoalLabel(book)}</strong>
                    </div>
                    <div className="library-detail-card">
                      <span>Last session</span>
                      <strong>{book.lastSession ? formatDate(book.lastSession.sessionDate) : 'Not yet'}</strong>
                    </div>
                    <div className="library-detail-card">
                      <span>{book.status === 'finished' ? 'Finished' : 'Started'}</span>
                      <strong>{formatDate(book.status === 'finished' ? book.finishedOn : book.startedOn)}</strong>
                    </div>
                  </div>

                  {book.notes && <p className="library-notes">{book.notes}</p>}

                  <div className="library-item-footer">
                    <span className="library-insight">{getInsight(book)}</span>

                    {canWriteLibrary && (
                      <div className="library-actions">
                        <button
                          type="button"
                          className="library-secondary-btn"
                          onClick={() => openLogSessionModal(book)}
                        >
                          Log reading
                        </button>
                        <button
                          type="button"
                          className="library-secondary-btn"
                          onClick={() => setEditingBook(book)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <aside className="library-activity-panel">
              <div className="library-panel-header">
                <h4>Recent sessions</h4>
                <p>
                  {stats.finishedBooks > 0
                    ? `${pluralize(stats.finishedBooks, 'book')} finished so far`
                    : 'Latest reading logs and notes'}
                </p>
              </div>

              {recentSessions.length === 0 ? (
                <div className="library-panel-empty">
                  <p>No reading sessions yet. Start logging pages to build up the timeline.</p>
                </div>
              ) : (
                <div className="library-session-list">
                  {recentSessions.map((session) => (
                    <article key={session.id} className="library-session-item">
                      <div className="library-session-top">
                        <strong>{session.book?.title || 'Book removed'}</strong>
                        <span>{formatDate(session.sessionDate)}</span>
                      </div>
                      <p className="library-session-meta">
                        {session.pagesRead > 0
                          ? `${pluralize(session.pagesRead, 'page')} • ${session.startPage} to ${session.endPage}`
                          : `Note only • page ${session.startPage}`}
                      </p>
                      {session.notes && <p className="library-session-note">{session.notes}</p>}
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddBookModal && (
          <BookModal
            onClose={() => setShowAddBookModal(false)}
            onSubmit={addBook}
          />
        )}
        {editingBook && (
          <BookModal
            book={editingBook}
            onClose={() => setEditingBook(null)}
            onSubmit={updateBook}
            onDelete={deleteBook}
          />
        )}
        {showLogSessionModal && (
          <ReadingSessionModal
            books={books}
            defaultBook={selectedSessionBook}
            onClose={closeLogSessionModal}
            onSubmit={addSession}
          />
        )}
      </AnimatePresence>
    </BaseCard>
  );
}

export default LibraryCard;
