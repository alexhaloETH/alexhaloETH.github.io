function ProjectsHeader({ currentIndex, totalProjects, onPrev, onNext }) {
  return (
    <div className="carousel-header">
      <h2 className="carousel-title">Featured Projects</h2>
      <div className="carousel-nav">
        <button
          className="nav-arrow"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Previous project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="carousel-counter">
          {currentIndex + 1} / {totalProjects}
        </span>
        <button
          className="nav-arrow"
          onClick={onNext}
          disabled={currentIndex === totalProjects - 1}
          aria-label="Next project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProjectsHeader;
