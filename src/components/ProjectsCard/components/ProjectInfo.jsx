function ProjectInfo({ project }) {
  return (
    <div className="project-info">
      <div className="project-header">
        <h3 className="project-name">{project.title}</h3>
        <span
          className={`project-status ${
            project.status === 'Live' ? 'live' : 'dev'
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="project-tech">
        <span className="tech-label">Tech Stack</span>
        <div className="tech-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tech-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectInfo;
