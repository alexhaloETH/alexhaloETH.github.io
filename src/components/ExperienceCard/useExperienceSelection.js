import { useMemo, useState } from 'react';
import { experiences, TIMELINE_END_YEAR, TIMELINE_START_YEAR } from '../../data/experience';

const useExperienceSelection = () => {
  const latestExperience = useMemo(() => {
    const current = experiences.find(exp => exp.endDate === null);
    if (current) return current;
    return experiences.reduce((latest, exp) =>
      exp.startDate > latest.startDate ? exp : latest
    );
  }, []);

  const [selectedExperience, setSelectedExperience] = useState(latestExperience);

  const sortedExperiences = useMemo(
    () => [...experiences].sort((a, b) => a.startDate - b.startDate),
    []
  );

  const getNextExperience = (currentExp) => {
    const currentIndex = sortedExperiences.findIndex(exp => exp.id === currentExp.id);
    return sortedExperiences[currentIndex + 1] || null;
  };

  const getTimelinePosition = (date) => {
    const startTime = new Date(TIMELINE_START_YEAR, 0).getTime();
    const endTime = new Date(TIMELINE_END_YEAR, 11, 31).getTime();
    const dateTime = date.getTime();

    return ((dateTime - startTime) / (endTime - startTime)) * 100;
  };

  const formatDate = (date) => (
    date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  );

  const getPeriodText = (exp) => {
    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : 'Present';
    return `${start} - ${end}`;
  };

  return {
    selectedExperience,
    setSelectedExperience,
    getNextExperience,
    getTimelinePosition,
    getPeriodText,
  };
};

export default useExperienceSelection;
