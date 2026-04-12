import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BaseCard from '../../BaseCard/BaseCard';
import { useNotification } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import useGymData from './useGymData';
import { TABS } from './GymCard.constants';
import {
  GymDashboardView,
  WorkoutPlanView,
  ExercisesView,
  StretchingView,
  AnalyticsView,
  BodyweightView,
  WorkoutLogger,
} from './components';
import './GymCard.css';

const TAB_CONFIG = [
  { id: TABS.DASHBOARD, label: 'Dashboard', icon: 'home' },
  { id: TABS.PLAN, label: 'Plan', icon: 'calendar' },
  { id: TABS.EXERCISES, label: 'Exercises', icon: 'dumbbell' },
  { id: TABS.STRETCHING, label: 'Stretching', icon: 'stretch' },
  { id: TABS.ANALYTICS, label: 'Analytics', icon: 'chart' },
  { id: TABS.BODYWEIGHT, label: 'Weight', icon: 'scale' },
];

const TabIcon = ({ type }) => {
  switch (type) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6.5 6.5a2.5 2.5 0 0 1 3.5 0L12 8.5l2-2a2.5 2.5 0 0 1 3.5 3.5l-2 2 2 2a2.5 2.5 0 0 1-3.5 3.5l-2-2-2 2a2.5 2.5 0 0 1-3.5-3.5l2-2-2-2a2.5 2.5 0 0 1 0-3.5z" />
        </svg>
      );
    case 'stretch':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="5" r="3" />
          <path d="M12 8v4" />
          <path d="M8 20l4-8 4 8" />
          <path d="M6 12l6 4" />
          <path d="M18 12l-6 4" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'scale':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    default:
      return null;
  }
};

function GymCard() {
  const { showNotification } = useNotification();
  const { canWrite } = useAuth();
  const canWriteGym = canWrite('gym');
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  const gymData = useGymData(showNotification, {
    canReadGym: true,
    canWriteGym,
  });

  const {
    exercises,
    isLoading,
    isSeeding,
    runSeed,
    activeSession,
    setActiveSession,
    stats,
  } = gymData;

  const subtitle = stats.workoutStreak > 0
    ? `${stats.workoutStreak} day streak`
    : stats.workoutsThisWeek > 0
      ? `${stats.workoutsThisWeek} workouts this week`
      : 'Track workouts, progress, and goals';

  const renderTabContent = () => {
    // If there's an active workout session, show the workout logger
    if (activeSession) {
      return (
        <WorkoutLogger
          gymData={gymData}
          canWrite={canWriteGym}
          onClose={() => setActiveSession(null)}
        />
      );
    }

    switch (activeTab) {
      case TABS.DASHBOARD:
        return <GymDashboardView gymData={gymData} canWrite={canWriteGym} />;
      case TABS.PLAN:
        return <WorkoutPlanView gymData={gymData} canWrite={canWriteGym} />;
      case TABS.EXERCISES:
        return <ExercisesView gymData={gymData} canWrite={canWriteGym} />;
      case TABS.STRETCHING:
        return <StretchingView gymData={gymData} canWrite={canWriteGym} />;
      case TABS.ANALYTICS:
        return <AnalyticsView gymData={gymData} />;
      case TABS.BODYWEIGHT:
        return <BodyweightView gymData={gymData} canWrite={canWriteGym} />;
      default:
        return null;
    }
  };

  return (
    <BaseCard className="card secret-card gym-card">
      <div className="card-header gym-card-header">
        <div className="gym-title-block">
          <div className="card-icon gym">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6.5 6.5a2.5 2.5 0 0 1 3.5 0L12 8.5l2-2a2.5 2.5 0 0 1 3.5 3.5l-2 2 2 2a2.5 2.5 0 0 1-3.5 3.5l-2-2-2 2a2.5 2.5 0 0 1-3.5-3.5l2-2-2-2a2.5 2.5 0 0 1 0-3.5z" />
            </svg>
          </div>
          <div>
            <h3>Gym Tracker</h3>
            <p className="gym-subtitle">{subtitle}</p>
          </div>
        </div>

        {canWriteGym && exercises.length === 0 && !isLoading && (
          <button
            type="button"
            className="gym-seed-btn"
            onClick={runSeed}
            disabled={isSeeding}
          >
            {isSeeding ? 'Seeding...' : 'Seed Data'}
          </button>
        )}
      </div>

      {!activeSession && (
        <nav className="gym-tabs">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`gym-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon type={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="card-content gym-content">
        {isLoading ? (
          <div className="gym-loading">
            <p>Loading gym tracker...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        )}
      </div>
    </BaseCard>
  );
}

export default GymCard;
