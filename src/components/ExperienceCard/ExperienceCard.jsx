import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./ExperienceCard.css";

const experiences = [
  {
    id: 1,
    title: "Blockchain Developer",
    company: "Web3 Startup",
    icon: "🚀", // Can be emoji or image URL
    startDate: new Date(2023, 0), // January 2023
    endDate: null, // Present
    description: "Building decentralized applications and smart contracts. Working with Solidity, Ethereum, and various Web3 technologies.",
    highlights: [
      "Deployed 15+ smart contracts managing $2M+ in assets",
      "Reduced gas costs by 40% through optimization",
      "Led team of 3 junior developers"
    ],
    skills: ["Solidity", "Ethereum", "React", "Web3.js", "Smart Contracts"],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Tech Company",
    icon: "💻",
    startDate: new Date(2021, 1), // February 2021
    endDate: new Date(2023, 0), // January 2023
    description: "Developed scalable web applications with React and Node.js. Led frontend architecture decisions.",
    highlights: [
      "Improved application performance by 60%",
      "Architected microservices handling 100K+ daily users",
      "Mentored 5 junior developers"
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    id: 3,
    title: "Junior Developer",
    company: "Digital Agency",
    icon: "🎨",
    startDate: new Date(2020, 2), // March 2020
    endDate: new Date(2021, 1), // February 2021
    description: "Created responsive websites and web applications. Learned modern development practices.",
    highlights: [
      "Built 20+ responsive client websites",
      "Achieved 98% client satisfaction rating",
      "Reduced page load times by 50%"
    ],
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
  },
];

const TIMELINE_START_YEAR = 2020;
const TIMELINE_END_YEAR = new Date().getFullYear();

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function ExperienceCard() {
  // Find the current/latest experience (one with endDate null or most recent)
  const latestExperience = useMemo(() => {
    const current = experiences.find(exp => exp.endDate === null);
    if (current) return current;
    return experiences.reduce((latest, exp) =>
      exp.startDate > latest.startDate ? exp : latest
    );
  }, []);

  const [selectedExperience, setSelectedExperience] = useState(latestExperience);

  // Get the next experience (by start date) after the selected one
  const getNextExperience = (currentExp) => {
    const sortedExps = [...experiences].sort((a, b) => a.startDate - b.startDate);
    const currentIndex = sortedExps.findIndex(exp => exp.id === currentExp.id);
    return sortedExps[currentIndex + 1] || null;
  };

  // Calculate position on timeline (0 to 100%)
  const getTimelinePosition = (date) => {
    const startTime = new Date(TIMELINE_START_YEAR, 0).getTime();
    const endTime = new Date(TIMELINE_END_YEAR, 11, 31).getTime();
    const dateTime = date.getTime();

    return ((dateTime - startTime) / (endTime - startTime)) * 100;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getPeriodText = (exp) => {
    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <BaseCard className="card card-experience">
      <div className="experience-content">
        <h2 className="experience-title">Experience</h2>

        {/* Experience details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedExperience.id}
            className="experience-details"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {selectedExperience.icon && (
              <div className="experience-icon">
                {selectedExperience.icon.startsWith('http') ? (
                  <img src={selectedExperience.icon} alt={selectedExperience.company} />
                ) : (
                  <span>{selectedExperience.icon}</span>
                )}
              </div>
            )}
            <div className="experience-header">
              <h3 className="experience-role">{selectedExperience.title}</h3>
              <span className="experience-period">{getPeriodText(selectedExperience)}</span>
            </div>
            <div className="experience-company">{selectedExperience.company}</div>
            <div className="experience-description">{selectedExperience.description}</div>
            {selectedExperience.highlights && (
              <ul className="experience-highlights">
                {selectedExperience.highlights.map((highlight, index) => (
                  <li key={index} className="experience-highlight">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            {selectedExperience.skills && (
              <div className="experience-skills">
                {selectedExperience.skills.map((skill) => (
                  <span key={skill} className="experience-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Timeline */}
        <div className="timeline-container">
          {/* Year labels */}
          <div className="timeline-years">
            <div className="timeline-year">{TIMELINE_START_YEAR}</div>
            <div className="timeline-year">Now</div>
          </div>

          <div className="timeline-line" />

          {/* Animated fill line */}
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
              ease: "easeInOut"
            }}
          />

          {/* Experience dots */}
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
                  onClick={() => setSelectedExperience(exp)}
                  aria-label={`View ${exp.title} at ${exp.company}`}
                >
                  {isCurrent && <div className="pulse-ring" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export default ExperienceCard;
