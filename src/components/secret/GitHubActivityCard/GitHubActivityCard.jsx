import ActivityFeed from './components/ActivityFeed';
import ActivityFooter from './components/ActivityFooter';
import ActivityHeader from './components/ActivityHeader';
import useGitHubActivity from './useGitHubActivity';
import './GitHubActivityCard.css';

function GitHubActivityCard() {
  const {
    activities,
    loading,
    lastUpdate,
    error,
  } = useGitHubActivity();

  return (
    <div className="github-activity-card">
      <ActivityHeader lastUpdate={lastUpdate} />

      <div className="activity-feed">
        <ActivityFeed
          loading={loading}
          error={error}
          activities={activities}
        />
      </div>

      <ActivityFooter />
    </div>
  );
}

export default GitHubActivityCard;
