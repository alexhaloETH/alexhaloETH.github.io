import { motion } from 'framer-motion';
import { TIMELINE_START_YEAR } from '../../../data/experience';

function ExperienceTimeline({
  experiences,
  selectedExperience,
  onSelect,
  getTimelinePosition,
  getNextExperience,
}) {
  return (
    <div className="timeline-container">
      <div className="timeline-years">
        <div className="timeline-year">{TIMELINE_START_YEAR}</div>
        <div className="timeline-year">Now</div>
      </div>

      <div className="timeline-line" />

      <motion.div
        key={selectedExperience.id}
        className="timeline-fill"
        initial={{
          left: `${getTimelinePosition(selectedExperience.startDate)}%`,
          right: `${100 - getTimelinePosition(selectedExperience.startDate)}%`,
          opacity: 1
        }}
        animate={{
          left: `${getTimelinePosition(selectedExperience.startDate)}%`,
          right: getNextExperience(selectedExperience)
            ? `${100 - getTimelinePosition(getNextExperience(selectedExperience).startDate)}%`
            : '0%',
          opacity: 1
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut'
        }}
      />

      <div className="timeline-dots">
        {experiences.map((exp) => {
          const position = getTimelinePosition(exp.startDate);
          const isSelected = selectedExperience.id === exp.id;
          const isCurrent = exp.endDate === null;

          return (
            <button
              key={exp.id}
              className={`timeline-dot ${isSelected ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
              style={{ left: `${position}%` }}
              onClick={() => onSelect(exp)}
              aria-label={`View ${exp.title} at ${exp.company}`}
            >
              {isCurrent && <div className="pulse-ring" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ExperienceTimeline;
