import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import { places, stats } from "../../data/places";
import "./WorldCard.css";
import DottedWorldMap from "./DottedWorldMap";

const textVariants = {
  initial: { opacity: 0, y: 6, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

function WorldCard() {
  const [initialized, setInitialized] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);

  const activePlace = useMemo(() => places[index % places.length], [index]);

  useEffect(() => {
    if (!ready || places.length === 0) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % places.length);
    }, 5000);

    return () => clearInterval(id);
  }, [ready]);

  const handleLoadMap = () => {
    setInitialized(true);
  };

  if (!initialized) {
    return (
      <BaseCard className="card card-world card-world-uninitialized" variant="no-padding">
        <div className="world-content world-placeholder">
          <div className="world-placeholder-content">
            <h2 className="world-placeholder-title">Work Travel Map</h2>
            <p className="world-placeholder-desc">
              View locations I've visited and worked from around the world
            </p>
            <button className="world-load-btn" onClick={handleLoadMap}>
              <svg className="world-load-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Show Travel Map
            </button>
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard className={`card card-world ${ready ? "is-ready" : "is-loading"}`} variant="no-padding">
      {!ready && <div className="world-card-loader" />}

      <div className="world-content">
        <div className="world-map">
          <DottedWorldMap
            places={places}
            dotStepDeg={2.5}
            onReady={setReady}
            activePlaceId={activePlace?.id}
          />
        </div>

        <div className="world-info">
          <div className="world-spotlight">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlace?.id}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="world-spotlight-title">
                  {activePlace?.title}
                </div>
                <div className="world-spotlight-desc">
                  {activePlace?.description}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
  {stats.map((s) => (
    <div className="world-row" key={s.label}>
      <span className="world-label">{s.label}</span>
      <span className="world-value">{s.value}</span>
    </div>
  ))}

        </div>
      </div>
    </BaseCard>
  );
}

export default WorldCard;
