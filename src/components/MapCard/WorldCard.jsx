import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./WorldCard.css";
import DottedWorldMap from "./DottedWorldMap";

const places = [
  { id: "lisbon", title: "Lisbon", description: "Visited.", lat: 38.7223, lon: -9.1393 },
  { id: "budapest", title: "Budapest", description: "Visited.", lat: 47.4979, lon: 19.0402 },
  { id: "london", title: "London", description: "Visited / worked.", lat: 51.5074, lon: -0.1278 },
  { id: "bangkok", title: "Bangkok", description: "Visited.", lat: 13.7563, lon: 100.5018 },
  { id: "brussels", title: "Brussels", description: "Visited.", lat: 50.8503, lon: 4.3517 },
  { id: "new-york", title: "New York", description: "Visited / worked.", lat: 40.7128, lon: -74.006 },
  { id: "bali", title: "Bali", description: "Visited.", lat: -8.4095, lon: 115.1889 },
  { id: "nice", title: "Nice", description: "Visited.", lat: 43.7102, lon: 7.262 },
  { id: "istanbul", title: "Istanbul", description: "Visited.", lat: 41.0082, lon: 28.9784 },
  { id: "catania", title: "Catania", description: "Visited / worked.", lat: 37.5079, lon: 15.083 },
  { id: "milan", title: "Milan", description: "Visited.", lat: 45.4642, lon: 9.19 },
  { id: "napoli", title: "Napoli", description: "Visited.", lat: 40.8518, lon: 14.2681 },
];

const textVariants = {
  initial: { opacity: 0, y: 6, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

const stats = [
  { label: "Current base", value: "Newport" },
  { label: "Events attended", value: 12 }
];

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
    <div className={`card card-world ${ready ? "is-ready" : "is-loading"}`}>
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
    </div>
  );
}

export default WorldCard;
