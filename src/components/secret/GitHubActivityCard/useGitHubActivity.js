import { useEffect, useState } from 'react';
import { GITHUB_USERNAME, MOCK_ACTIVITIES, USE_REAL_API } from './GitHubActivityCard.constants';

const useGitHubActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchGitHubActivity = async () => {
    try {
      console.log('[GitHub Activity] Starting fetch...');
      console.log('[GitHub Activity] Username:', GITHUB_USERNAME);
      console.log('[GitHub Activity] Token value:', import.meta.env.VITE_GITHUB_TOKEN ? `${import.meta.env.VITE_GITHUB_TOKEN.substring(0, 8)}...` : 'undefined');
      console.log('[GitHub Activity] Has token:', !!import.meta.env.VITE_GITHUB_TOKEN);
      console.log('[GitHub Activity] All env vars:', Object.keys(import.meta.env));

      setLoading(true);
      setError(null);

      // Fetch user events from GitHub API
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
      };

      // Add token if available (injected at build time via GitHub Actions)
      if (import.meta.env.VITE_GITHUB_TOKEN) {
        headers['Authorization'] = `token ${import.meta.env.VITE_GITHUB_TOKEN}`;
        console.log('[GitHub Activity] Token added to headers');
      } else {
        console.log('[GitHub Activity] No token found, using unauthenticated request');
      }

      // Fetch from authenticated events endpoint (includes private repos when token has access)
      const url = `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`;
      console.log('[GitHub Activity] Fetching from:', url);

      const response = await fetch(url, { headers });

      console.log('[GitHub Activity] Response status:', response.status);
      console.log('[GitHub Activity] Response headers:', {
        rateLimit: response.headers.get('X-RateLimit-Limit'),
        rateRemaining: response.headers.get('X-RateLimit-Remaining'),
        rateReset: response.headers.get('X-RateLimit-Reset')
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const events = await response.json();
      console.log('[GitHub Activity] Received events:', events.length);
      console.log('[GitHub Activity] Event types:', events.map(e => e.type).join(', '));

      // Transform GitHub events to our activity format
      const transformedActivities = events
        .map(event => {
          if (!event || !event.type || !event.repo || !event.created_at) {
            return null;
          }

          const baseActivity = {
            id: event.id,
            repo: event.repo.name,
            timestamp: new Date(event.created_at)
          };

          try {
            switch (event.type) {
              case 'PushEvent': {
                if (!event.payload?.ref) {
                  return null;
                }

                const commits = event.payload?.commits || [];
                const commitCount = event.payload?.size || commits.length || 1;

                let commitMessage = 'Pushed commits';
                if (Array.isArray(commits) && commits.length > 0) {
                  commitMessage = commits[0]?.message || 'Pushed commits';

                  if (commitMessage.length > 100) {
                    commitMessage = commitMessage.substring(0, 97) + '...';
                  }
                } else if (event.payload?.head) {
                  commitMessage = `Pushed to ${event.payload.ref.replace('refs/heads/', '')}`;
                }

                return {
                  ...baseActivity,
                  type: 'push',
                  message: commitMessage,
                  commits: commitCount,
                  branch: event.payload.ref.replace('refs/heads/', ''),
                  sha: event.payload?.head || (commits.length > 0 ? commits[0]?.sha : null),
                  compareUrl: event.payload?.before && event.payload?.head
                    ? `https://github.com/${event.repo.name}/compare/${event.payload.before.substring(0, 7)}...${event.payload.head.substring(0, 7)}`
                    : null
                };
              }

              case 'WatchEvent':
                return {
                  ...baseActivity,
                  type: 'star',
                  message: 'Starred repository',
                  stars: event.repo?.stargazers_count || 0
                };

              case 'PullRequestEvent':
                if (!event.payload?.pull_request) {
                  return null;
                }
                return {
                  ...baseActivity,
                  type: 'pull_request',
                  message: event.payload.pull_request.title || 'Pull request',
                  status: event.payload.pull_request.merged ? 'merged' : event.payload.pull_request.state,
                  additions: event.payload.pull_request.additions || 0,
                  deletions: event.payload.pull_request.deletions || 0
                };

              case 'IssuesEvent':
                if (!event.payload?.issue) {
                  return null;
                }
                return {
                  ...baseActivity,
                  type: 'issue',
                  message: `${event.payload.action || 'updated'} issue: ${event.payload.issue.title || 'Issue'}`,
                  status: event.payload.issue.state,
                  comments: event.payload.issue.comments || 0
                };

              case 'CreateEvent':
                if (event.payload?.ref_type === 'repository') {
                  return {
                    ...baseActivity,
                    type: 'create',
                    message: 'Created new repository',
                    language: event.repo?.language || 'Unknown'
                  };
                }
                return null;

              default:
                return null;
            }
          } catch (err) {
            console.error('[GitHub Activity] Error transforming event:', event.type, err);
            return null;
          }
        })
        .filter(Boolean)
        .slice(0, 150);

      console.log('[GitHub Activity] Transformed activities:', transformedActivities.length);
      console.log('[GitHub Activity] Activities:', transformedActivities);

      const groupedActivities = transformedActivities.reduce((groups, activity) => {
        const repo = activity.repo;
        if (!groups[repo]) {
          groups[repo] = {
            repo,
            activities: [],
            timestamp: activity.timestamp,
            types: {}
          };
        }
        groups[repo].activities.push(activity);

        const type = activity.type;
        groups[repo].types[type] = (groups[repo].types[type] || 0) + 1;

        if (activity.timestamp > groups[repo].timestamp) {
          groups[repo].timestamp = activity.timestamp;
        }

        return groups;
      }, {});

      const groupedArray = Object.values(groupedActivities)
        .sort((a, b) => b.timestamp - a.timestamp);

      setActivities(groupedArray);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(err.message);
      setActivities(MOCK_ACTIVITIES);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadActivities = () => {
      if (USE_REAL_API) {
        fetchGitHubActivity();
      } else {
        setTimeout(() => {
          setActivities(MOCK_ACTIVITIES);
          setLoading(false);
          setLastUpdate(new Date());
        }, 1000);
      }
    };

    loadActivities();

    const interval = setInterval(() => {
      loadActivities();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    activities,
    loading,
    lastUpdate,
    error,
  };
};

export default useGitHubActivity;
