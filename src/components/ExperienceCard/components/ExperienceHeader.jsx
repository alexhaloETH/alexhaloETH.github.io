function ExperienceHeader({ viewMode, onToggle }) {
  const isExperience = viewMode === 'experience';

  return (
    <div className="experience-header-row">
      <h2 className="experience-title">
        {isExperience ? 'Experience' : 'GitHub Activity'}
      </h2>
      <button
        className="view-toggle-btn"
        onClick={onToggle}
        aria-label={`Switch to ${isExperience ? 'GitHub Activity' : 'Experience'} view`}
        title={`Switch to ${isExperience ? 'GitHub Activity' : 'Experience'} view`}
      >
        🔄
      </button>
    </div>
  );
}

export default ExperienceHeader;
