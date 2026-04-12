import PanelShell from './PanelShell';

function LibraryPanel({ data }) {
  const { library } = data;
  const progressLabel = library.dailyGoal
    ? `${library.pagesToday} / ${library.dailyGoal}`
    : String(library.pagesToday);

  return (
    <PanelShell eyebrow="Library" title="Reading">
      {!library.ok && (
        <div className="pi-empty">
          <strong>Library unavailable</strong>
          <span>{library.error || 'No reading data loaded'}</span>
        </div>
      )}

      {library.ok && (
        <>
          <div className="pi-big-stat">
            <span>Pages today</span>
            <strong>{progressLabel}</strong>
          </div>

          <div className="pi-focus-card">
            <span>Current</span>
            <strong>{library.currentBook?.title || 'No book active'}</strong>
            <small>
              {library.currentBook
                ? `page ${library.currentBook.currentPage}`
                : 'Add a book in the library tracker'}
            </small>
          </div>

          <div className="pi-mini-section">
            <span>Streak</span>
            <strong>{library.streak}d</strong>
          </div>
        </>
      )}
    </PanelShell>
  );
}

export default LibraryPanel;
