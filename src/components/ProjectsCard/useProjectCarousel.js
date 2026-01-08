import { useCallback, useEffect, useRef, useState } from 'react';

const useProjectCarousel = (projects) => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const currentProject = projects[currentIndex];

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (currentProject?.images && currentProject.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % currentProject.images.length);
      }, 5000);
    }
  }, [currentProject]);

  useEffect(() => {
    resetTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, resetTimer]);

  const paginate = (newDirection) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < projects.length) {
      setCurrentIndex([newIndex, newDirection]);
      setImageIndex(0);
    }
  };

  const goToProject = (index) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setCurrentIndex([index, newDirection]);
    setImageIndex(0);
  };

  const nextImage = () => {
    if (currentProject?.images && currentProject.images.length > 0) {
      setImageIndex((prev) => (prev + 1) % currentProject.images.length);
      resetTimer();
    }
  };

  const prevImage = () => {
    if (currentProject?.images && currentProject.images.length > 0) {
      setImageIndex((prev) =>
        prev === 0 ? currentProject.images.length - 1 : prev - 1
      );
      resetTimer();
    }
  };

  const goToImage = (idx) => {
    setImageIndex(idx);
    resetTimer();
  };

  return {
    currentIndex,
    direction,
    imageIndex,
    currentProject,
    paginate,
    goToProject,
    nextImage,
    prevImage,
    goToImage,
  };
};

export default useProjectCarousel;
