import { motion } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./ExperienceCard.css";

const experiences = [
  {
    title: "Blockchain Developer",
    company: "Web3 Startup",
    period: "2023 - Present",
    description: "Building decentralized applications and smart contracts",
  },
  {
    title: "Full Stack Developer",
    company: "Tech Company",
    period: "2021 - 2023",
    description: "Developed scalable web applications with React and Node.js",
  },
  {
    title: "Junior Developer",
    company: "Digital Agency",
    period: "2020 - 2021",
    description: "Created responsive websites and web applications",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

function ExperienceCard() {
  return (
    <BaseCard className="card card-experience">
      <div className="experience-content">
        <h2 className="experience-title">Experience</h2>
        <motion.div
          className="experience-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {experiences.map((exp, index) => (
            <motion.div key={index} className="experience-item" variants={itemVariants}>
              <div className="experience-header">
                <h3 className="experience-role">{exp.title}</h3>
                <span className="experience-period">{exp.period}</span>
              </div>
              <div className="experience-company">{exp.company}</div>
              <div className="experience-description">{exp.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </BaseCard>
  );
}

export default ExperienceCard;
