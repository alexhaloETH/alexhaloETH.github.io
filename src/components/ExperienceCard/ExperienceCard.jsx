import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import { experiences } from "../../data/experience";
import ExperienceDetails from "./components/ExperienceDetails";
import ExperienceHeader from "./components/ExperienceHeader";
import ExperienceTimeline from "./components/ExperienceTimeline";
import GitHubActivityCard from "../secret/GitHubActivityCard/GitHubActivityCard";
import useExperienceSelection from "./useExperienceSelection";
import "./ExperienceCard.css";

function ExperienceCard() {
  const [viewMode, setViewMode] = useState('experience');
  const {
    selectedExperience,
    setSelectedExperience,
    getNextExperience,
    getTimelinePosition,
    getPeriodText,
  } = useExperienceSelection();

  return (
    <BaseCard className="card card-experience">
      <div className="experience-content">
        <ExperienceHeader
          viewMode={viewMode}
          onToggle={() => setViewMode(viewMode === 'experience' ? 'github' : 'experience')}
        />

        <AnimatePresence mode="wait">
          {viewMode === 'experience' ? (
            <motion.div
              key="experience-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            >
              {/* Experience details */}
              <ExperienceDetails
                experience={selectedExperience}
                getPeriodText={getPeriodText}
              />

              {/* Timeline */}
              <ExperienceTimeline
                experiences={experiences}
                selectedExperience={selectedExperience}
                onSelect={setSelectedExperience}
                getTimelinePosition={getTimelinePosition}
                getNextExperience={getNextExperience}
              />
            </motion.div>
          ) : (
            <motion.div
              key="github-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="github-view-wrapper"
            >
              <GitHubActivityCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseCard>
  );
}

export default ExperienceCard;
