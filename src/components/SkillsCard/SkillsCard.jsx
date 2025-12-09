import { motion } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./SkillsCard.css";

const skills = [
  { category: "Languages", items: ["Solidity", "JavaScript", "TypeScript", "Python", "Rust"] },
  { category: "Blockchain", items: ["Ethereum", "Smart Contracts", "Web3.js", "Ethers.js", "Hardhat"] },
  { category: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

function SkillsCard() {
  return (
    <BaseCard className="card card-skills">
      <div className="skills-content">
        <h2 className="skills-title">Skills & Technologies</h2>
        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {skills.map((skillGroup) => (
            <motion.div key={skillGroup.category} className="skill-group" variants={itemVariants}>
              <div className="skill-category">{skillGroup.category}</div>
              <div className="skill-items">
                {skillGroup.items.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </BaseCard>
  );
}

export default SkillsCard;
