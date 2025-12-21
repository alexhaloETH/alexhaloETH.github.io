import { useState } from 'react';
import { motion } from 'framer-motion';
import './SkillTreeCard.css';

const skillTreeData = {
  frontend: {
    name: 'Frontend',
    color: '#4ade80',
    skills: [
      { name: 'React', level: 5, unlocked: true, dependencies: [] },
      { name: 'Next.js', level: 4, unlocked: true, dependencies: ['React'] },
      { name: 'TypeScript', level: 5, unlocked: true, dependencies: [] },
      { name: 'Tailwind', level: 4, unlocked: true, dependencies: [] },
      { name: 'Framer Motion', level: 4, unlocked: true, dependencies: ['React'] },
    ]
  },
  backend: {
    name: 'Backend',
    color: '#22d3ee',
    skills: [
      { name: 'Node.js', level: 5, unlocked: true, dependencies: [] },
      { name: 'Express', level: 4, unlocked: true, dependencies: ['Node.js'] },
      { name: 'PostgreSQL', level: 4, unlocked: true, dependencies: [] },
      { name: 'MongoDB', level: 3, unlocked: true, dependencies: [] },
      { name: 'GraphQL', level: 3, unlocked: true, dependencies: ['Node.js'] },
    ]
  },
  devops: {
    name: 'DevOps',
    color: '#ec4899',
    skills: [
      { name: 'Docker', level: 4, unlocked: true, dependencies: [] },
      { name: 'Kubernetes', level: 3, unlocked: true, dependencies: ['Docker'] },
      { name: 'AWS', level: 4, unlocked: true, dependencies: [] },
      { name: 'CI/CD', level: 4, unlocked: true, dependencies: [] },
      { name: 'Terraform', level: 2, unlocked: false, dependencies: ['AWS'] },
    ]
  },
  blockchain: {
    name: 'Blockchain',
    color: '#f59e0b',
    skills: [
      { name: 'Solidity', level: 4, unlocked: true, dependencies: [] },
      { name: 'Web3.js', level: 4, unlocked: true, dependencies: ['Solidity'] },
      { name: 'Hardhat', level: 3, unlocked: true, dependencies: ['Solidity'] },
      { name: 'Smart Contracts', level: 4, unlocked: true, dependencies: ['Solidity'] },
      { name: 'DeFi', level: 3, unlocked: true, dependencies: ['Smart Contracts'] },
    ]
  }
};

function SkillTreeCard() {
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const category = skillTreeData[selectedCategory];

  return (
    <div className="skill-tree-card">
      <div className="skill-tree-header">
        <div className="card-icon skill-tree">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <h3>Skill Tree</h3>
          <p className="card-subtitle">RPG-style progression</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="skill-categories">
        {Object.keys(skillTreeData).map((key) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(key);
              setSelectedSkill(null);
            }}
            style={{
              '--category-color': selectedCategory === key ? skillTreeData[key].color : 'transparent'
            }}
          >
            {skillTreeData[key].name}
          </button>
        ))}
      </div>

      {/* Skill Tree Visualization */}
      <div className="skill-tree-container">
        <svg className="skill-tree-svg" viewBox="0 0 400 300">
          {/* Connection lines */}
          {category.skills.map((skill, index) => {
            if (skill.dependencies.length > 0) {
              const parentIndex = category.skills.findIndex(
                s => s.name === skill.dependencies[0]
              );
              if (parentIndex !== -1) {
                const x1 = 50 + (parentIndex % 3) * 150;
                const y1 = 50 + Math.floor(parentIndex / 3) * 100;
                const x2 = 50 + (index % 3) * 150;
                const y2 = 50 + Math.floor(index / 3) * 100;
                return (
                  <motion.line
                    key={`line-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={skill.unlocked ? category.color : '#444'}
                    strokeWidth="2"
                    strokeDasharray={skill.unlocked ? '0' : '5,5'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                );
              }
            }
            return null;
          })}

          {/* Skill nodes */}
          {category.skills.map((skill, index) => {
            const x = 50 + (index % 3) * 150;
            const y = 50 + Math.floor(index / 3) * 100;
            return (
              <g key={skill.name}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="30"
                  fill={skill.unlocked ? category.color : '#1a1a1a'}
                  stroke={skill.unlocked ? category.color : '#444'}
                  strokeWidth="3"
                  className="skill-node"
                  onClick={() => setSelectedSkill(skill)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{ cursor: 'pointer' }}
                />
                {skill.unlocked && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="35"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="2"
                    opacity="0.3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                )}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill={skill.unlocked ? '#0a0a0a' : '#666'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {skill.level}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Skill Details */}
      {selectedSkill && (
        <motion.div
          className="skill-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="skill-detail-header">
            <h4>{selectedSkill.name}</h4>
            <span className={`skill-status ${selectedSkill.unlocked ? 'unlocked' : 'locked'}`}>
              {selectedSkill.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <div className="skill-level-bar">
            <div className="level-label">Level {selectedSkill.level}/5</div>
            <div className="level-progress">
              <motion.div
                className="level-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(selectedSkill.level / 5) * 100}%` }}
                style={{ background: category.color }}
              />
            </div>
          </div>
          {selectedSkill.dependencies.length > 0 && (
            <div className="skill-dependencies">
              <span>Requires:</span> {selectedSkill.dependencies.join(', ')}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default SkillTreeCard;
