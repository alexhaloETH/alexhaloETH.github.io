import ThemeSwitcher from '../../ThemeSwitcher/ThemeSwitcher';

function SecretHeader({
  pages,
  currentPage,
  onPageChange,
  onExit,
  onLogout,
}) {
  return (
    <header className="secret-header">
      <div className="secret-header-left">
        <span className="secret-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secure Mode
        </span>
        <div className="page-indicator">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`page-dot ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onPageChange(page.id)}
              title={page.label}
            >
              <span className="page-number">{page.id}</span>
            </button>
          ))}
        </div>
        <span className="secret-title">Command Center</span>
      </div>
      <div className="secret-header-right">
        <ThemeSwitcher />
        <button className="secret-btn" onClick={onExit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Portfolio</span>
        </button>
        <button className="secret-btn logout" onClick={onLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default SecretHeader;
