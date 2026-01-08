import { AnimatePresence, motion } from 'framer-motion';
import { imageVariants } from '../ProjectsCard.animations';

function ProjectGallery({
  images,
  imageIndex,
  onPrev,
  onNext,
  onSelectImage,
  title,
}) {
  if (!images || images.length === 0) {
    return (
      <div className="project-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span>No images yet</span>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.img
          key={imageIndex}
          src={images[imageIndex]}
          alt={`${title} screenshot ${imageIndex + 1}`}
          className="project-image"
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="gallery-controls">
          <button className="gallery-arrow" onClick={onPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="gallery-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`gallery-dot ${idx === imageIndex ? 'active' : ''}`}
                onClick={() => onSelectImage(idx)}
              />
            ))}
          </div>
          <button className="gallery-arrow" onClick={onNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default ProjectGallery;
