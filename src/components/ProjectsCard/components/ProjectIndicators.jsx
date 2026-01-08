function ProjectIndicators({ projects, currentIndex, onSelect }) {
  return (
    <div className="carousel-indicators">
      {projects.map((project, index) => (
        <button
          key={project.id}
          className={`indicator ${index === currentIndex ? 'active' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Go to ${project.title}`}
        >
          <span className="indicator-label">{project.title}</span>
        </button>
      ))}
    </div>
  );
}

export default ProjectIndicators;
