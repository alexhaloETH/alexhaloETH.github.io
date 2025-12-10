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
