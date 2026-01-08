import { motion, AnimatePresence } from 'framer-motion';

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function ExperienceDetails({ experience, getPeriodText }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={experience.id}
        className="experience-details"
        variants={textVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {experience.icon && (
          <div className="experience-icon">
            {experience.icon.startsWith('http') ? (
              <img src={experience.icon} alt={experience.company} />
            ) : (
              <span>{experience.icon}</span>
            )}
          </div>
        )}
        <div className="experience-header">
          <h3 className="experience-role">{experience.title}</h3>
          <span className="experience-period">{getPeriodText(experience)}</span>
        </div>
        <div className="experience-company">{experience.company}</div>
        <div className="experience-description">{experience.description}</div>
        {experience.highlights && (
          <ul className="experience-highlights">
            {experience.highlights.map((highlight, index) => (
              <li key={index} className="experience-highlight">
                {highlight}
              </li>
            ))}
          </ul>
        )}
        {experience.skills && (
          <div className="experience-skills">
            {experience.skills.map((skill) => (
              <span key={skill} className="experience-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ExperienceDetails;
