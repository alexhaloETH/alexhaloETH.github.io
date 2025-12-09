import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./ProjectsCard.css";

const projects = [
  {
    id: 1,
    title: "DeFi Protocol",
    description: "Decentralized finance protocol with lending and staking features",
    tags: ["Solidity", "React", "Web3.js"],
    status: "Live",
  },
  {
    id: 2,
    title: "NFT Marketplace",
    description: "Full-featured NFT marketplace with auction capabilities",
    tags: ["Ethereum", "Next.js", "IPFS"],
    status: "In Development",
  },
  {
    id: 3,
    title: "DAO Governance",
    description: "On-chain governance system for decentralized organizations",
    tags: ["Solidity", "TypeScript", "Hardhat"],
    status: "Live",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Interactive 3D portfolio with Unity integration",
    tags: ["React", "Unity", "Vite"],
    status: "Live",
  },
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

function ProjectsCard() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <BaseCard className="card wide card-projects">
      <div className="projects-content">
        <h2 className="projects-title">Featured Projects</h2>
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-item"
              variants={itemVariants}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-status ${project.status === "Live" ? "live" : "dev"}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <AnimatePresence>
                {hoveredId === project.id && (
                  <motion.div
                    className="project-hover-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </BaseCard>
  );
}

export default ProjectsCard;
