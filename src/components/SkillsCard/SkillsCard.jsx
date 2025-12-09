import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./SkillsCard.css";

// Skills organized by category with sections
// Each skill has a description field you can fill in later
const skillsData = {
  stack: {
    languages: [
      { name: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", color: "#3178C6", description: "Click to learn more about TypeScript" },
      { name: "JavaScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg", color: "#F7DF1E", description: "Click to learn more about JavaScript" },
      { name: "C#", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg", color: "#239120", description: "Click to learn more about C#" },
      { name: "C++", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg", color: "#00599C", description: "Click to learn more about C++" },
      { name: "Python", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg", color: "#3776AB", description: "Click to learn more about Python" },
      { name: "Rust", icon: "https://www.rust-lang.org/logos/rust-logo-512x512.png", color: "#DEA584", description: "Click to learn more about Rust" },
      { name: "Cairo", icon: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", color: "#FF4F00", description: "Click to learn more about Cairo" },
    ],
    web: [
      { name: "React", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg", color: "#61DAFB", description: "Click to learn more about React" },
      { name: "HTML5", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg", color: "#E34F26", description: "Click to learn more about HTML5" },
      { name: "CSS3", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg", color: "#1572B6", description: "Click to learn more about CSS3" },
      { name: "GraphQL", icon: "https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg", color: "#E10098", description: "Click to learn more about GraphQL" },
    ],
    engines: [
      { name: "Unity", icon: "https://www.svgrepo.com/show/342325/unity.svg", color: "#FFFFFF", description: "Click to learn more about Unity" },
      { name: "Unreal", icon: "https://www.svgrepo.com/show/342328/unreal-engine.svg", color: "#0E1128", description: "Click to learn more about Unreal" },
      { name: "Bevy", icon: "https://cdn.worldvectorlogo.com/logos/bevy-1.svg", color: "#232326", description: "Click to learn more about Bevy" },
    ],
    tools: [
      { name: "Git", icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg", color: "#F05032", description: "Click to learn more about Git" },
      { name: "Blender", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/939px-Blender_logo_no_text.svg.png", color: "#F5792A", description: "Click to learn more about Blender" },
      { name: "Figma", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", color: "#F24E1E", description: "Click to learn more about Figma" },
    ],
  },
  learning: {
    exploring: [
      { name: "Rust", icon: "https://www.rust-lang.org/logos/rust-logo-512x512.png", color: "#DEA584", description: "Click to learn more about Rust" },
      { name: "Cairo", icon: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", color: "#FF4F00", description: "Click to learn more about Cairo" },
      { name: "Bevy", icon: "https://cdn.worldvectorlogo.com/logos/bevy-1.svg", color: "#232326", description: "Click to learn more about Bevy" },
    ],
  },
  improving: {
    focus: [
      { name: "Procedural Gen", icon: null, emoji: "🌱", color: "#4ADE80", description: "Click to learn more about Procedural Generation" },
      { name: "Bots & Automation", icon: null, emoji: "🤖", color: "#8B5CF6", description: "Click to learn more about Bots & Automation" },
      { name: "Game Dev", icon: null, emoji: "🎮", color: "#EC4899", description: "Click to learn more about Game Development" },
    ],
  },
};

const sectionLabels = {
  languages: "Languages",
  web: "Web",
  engines: "Game Engines",
  tools: "Tools",
  exploring: "Currently Exploring",
  focus: "Focus Areas",
};

const tabs = [
  { id: "stack", label: "Stack" },
  { id: "learning", label: "Learning" },
  { id: "improving", label: "Leveling Up" },
];

// Count total technologies across all stack categories
const totalTechCount = Object.values(skillsData.stack).reduce(
  (acc, skills) => acc + skills.length,
  0
);

function SkillsCard() {
  const [activeTab, setActiveTab] = useState("stack");
  const [selectedSkill, setSelectedSkill] = useState(null);

  const activeData = skillsData[activeTab];
  const sections = Object.entries(activeData);

  // Handle skill click
  const handleSkillClick = (skill) => {
    setSelectedSkill(selectedSkill?.name === skill.name ? null : skill);
  };

  // Reset selected skill when changing tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedSkill(null);
  };

  return (
    <BaseCard className="card card-skills">
      <div className="skills-content">
        <div className="skills-header">
          <h2 className="skills-title">Tech</h2>
          <div className="skills-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`skills-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="tab-indicator"
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="skills-sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {sections.map(([sectionKey, skills], sectionIndex) => (
                <div key={sectionKey} className="skills-section">
                  <span className="section-label">{sectionLabels[sectionKey]}</span>
                  <div className="skills-cloud">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        className={`skill-pill ${selectedSkill?.name === skill.name ? "selected" : ""}`}
                        style={{ "--skill-color": skill.color }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: sectionIndex * 0.1 + index * 0.03,
                          duration: 0.2,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSkillClick(skill)}
                      >
                        <div className="pill-glow" />
                        <div className="pill-content">
                          {skill.icon ? (
                            <img src={skill.icon} alt="" className="pill-icon" />
                          ) : (
                            <span className="pill-emoji">{skill.emoji}</span>
                          )}
                          <span className="pill-name">{skill.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="skills-footer">
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedSkill ? selectedSkill.name : "default"}
              className="skills-hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {selectedSkill
                ? selectedSkill.description
                : `${totalTechCount} technologies`}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </BaseCard>
  );
}

export default SkillsCard;
