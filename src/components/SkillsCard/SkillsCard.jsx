import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import { skillsData, sectionLabels, tabs } from "../../data/skills";
import "./SkillsCard.css";

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
