import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import { projects } from "../../data/projects";
import "./ProjectsCard.css";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const imageVariants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

function ProjectsCard() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [imageIndex, setImageIndex] = useState(0);

  const currentProject = projects[currentIndex];

  const paginate = (newDirection) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < projects.length) {
      setCurrentIndex([newIndex, newDirection]);
      setImageIndex(0);
    }
  };

  const goToProject = (index) => {
    const direction = index > currentIndex ? 1 : -1;
    setCurrentIndex([index, direction]);
    setImageIndex(0);
  };

  const nextImage = () => {
    if (currentProject.images && currentProject.images.length > 0) {
      setImageIndex((prev) => (prev + 1) % currentProject.images.length);
    }
  };

  const prevImage = () => {
    if (currentProject.images && currentProject.images.length > 0) {
      setImageIndex((prev) =>
        prev === 0 ? currentProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <BaseCard className="card wide card-projects">
      <div className="projects-carousel">
        <div className="carousel-header">
          <h2 className="carousel-title">Featured Projects</h2>
          <div className="carousel-nav">
            <button
              className="nav-arrow"
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              aria-label="Previous project"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="carousel-counter">
              {currentIndex + 1} / {projects.length}
            </span>
            <button
              className="nav-arrow"
              onClick={() => paginate(1)}
              disabled={currentIndex === projects.length - 1}
              aria-label="Next project"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentProject.id}
            className="carousel-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="project-content">
              {/* Image gallery section */}
              <div className="project-gallery">
                {currentProject.images && currentProject.images.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={imageIndex}
                        src={currentProject.images[imageIndex]}
                        alt={`${currentProject.title} screenshot ${imageIndex + 1}`}
                        className="project-image"
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>
                    {currentProject.images.length > 1 && (
                      <div className="gallery-controls">
                        <button className="gallery-arrow" onClick={prevImage}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <div className="gallery-dots">
                          {currentProject.images.map((_, idx) => (
                            <button
                              key={idx}
                              className={`gallery-dot ${idx === imageIndex ? "active" : ""}`}
                              onClick={() => setImageIndex(idx)}
                            />
                          ))}
                        </div>
                        <button className="gallery-arrow" onClick={nextImage}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="project-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>No images yet</span>
                  </div>
                )}
              </div>

              {/* Project info section */}
              <div className="project-info">
                <div className="project-header">
                  <h3 className="project-name">{currentProject.title}</h3>
                  <span
                    className={`project-status ${
                      currentProject.status === "Live" ? "live" : "dev"
                    }`}
                  >
                    {currentProject.status}
                  </span>
                </div>

                <p className="project-description">{currentProject.description}</p>

                <div className="project-tech">
                  <span className="tech-label">Tech Stack</span>
                  <div className="tech-tags">
                    {currentProject.tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Project indicators */}
        <div className="carousel-indicators">
          {projects.map((project, index) => (
            <button
              key={project.id}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToProject(index)}
              aria-label={`Go to ${project.title}`}
            >
              <span className="indicator-label">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}

export default ProjectsCard;
