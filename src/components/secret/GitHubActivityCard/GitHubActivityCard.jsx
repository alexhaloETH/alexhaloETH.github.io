import { useState, useEffect } from 'react';
import './GitHubActivityCard.css';

// Configuration - update with your GitHub username
const GITHUB_USERNAME = 'alexhaloETH'; // Change this to your GitHub username
const USE_REAL_API = true; // Set to true to use real GitHub API

function GitHubActivityCard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Mock GitHub activity data - replace with real API call later
  const mockActivities = [
    {
      id: 1,
      type: 'push',
      repo: 'alexhaloETH/portfolio-website',
      message: 'Added skill tree visualization and GitHub feed',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      commits: 3,
      branch: 'main'
    },
    {
      id: 2,
      type: 'star',
      repo: 'anthropics/claude-code',
      message: 'Starred repository',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      stars: 1247
    },
    {
      id: 3,
      type: 'pull_request',
      repo: 'alexhaloETH/blockchain-explorer',
      message: 'Implement EVM transaction decoder',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      status: 'merged',
      additions: 234,
      deletions: 67
    },
    {
      id: 4,
      type: 'push',
      repo: 'alexhaloETH/defi-dashboard',
      message: 'Fixed liquidity pool calculation bug',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      commits: 2,
      branch: 'develop'
    },
    {
      id: 5,
      type: 'create',
      repo: 'alexhaloETH/web3-analytics',
      message: 'Created new repository',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      language: 'TypeScript'
    },
    {
      id: 6,
      type: 'issue',
      repo: 'alexhaloETH/smart-contracts',
      message: 'Opened issue: Gas optimization for batch transfers',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      status: 'open',
      comments: 4
    }
  ];

  // Fetch real GitHub activity
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

      const url = `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`;
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

      // Transform GitHub events to our activity format
      const transformedActivities = events
        .map(event => {
          // Skip if missing required data
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
              case 'PushEvent':
                if (!event.payload?.commits || !Array.isArray(event.payload.commits) || !event.payload?.ref) {
                  return null;
                }
                return {
                  ...baseActivity,
                  type: 'push',
                  message: event.payload.commits[0]?.message || 'Pushed commits',
                  commits: event.payload.size || event.payload.commits.length,
                  branch: event.payload.ref.replace('refs/heads/', '')
                };

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
        .filter(Boolean) // Remove null entries
        .slice(0, 10); // Limit to 10 most recent

      setActivities(transformedActivities);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(err.message);
      // Fall back to mock data on error
      setActivities(mockActivities);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadActivities = () => {
      if (USE_REAL_API) {
        fetchGitHubActivity();
      } else {
        // Use mock data
        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
          setLastUpdate(new Date());
        }, 1000);
      }
    };

    loadActivities();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadActivities();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'push':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8m-4-4h8" />
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'pull_request':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12" />
          </svg>
        );
      case 'issue':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'create':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  const getActivityColor = (type) => {
    const colors = {
      push: '#4ade80',
      star: '#fbbf24',
      pull_request: '#a78bfa',
      issue: '#f87171',
      create: '#22d3ee'
    };
    return colors[type] || '#6b7280';
  };

  const getRelativeTime = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const formatUpdateTime = () => {
    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="github-activity-card">
      <div className="github-header">
        <div className="header-left">
          <div className="card-icon github">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </div>
          <div>
            <h3>GitHub Activity</h3>
            <p className="card-subtitle">Live Repository Feed</p>
          </div>
        </div>
        <div className="update-indicator">
          <div className="pulse-dot"></div>
          <span>Updated {formatUpdateTime()}</span>
        </div>
      </div>

      <div className="activity-feed">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner-small"></div>
            <p>Loading activity...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>Using mock data (API unavailable)</p>
            <span className="error-detail">{error}</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="activity-item"
                style={{ '--activity-color': getActivityColor(activity.type) }}
              >
                <div className="activity-icon" style={{ color: getActivityColor(activity.type) }}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-repo">{activity.repo}</span>
                    <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                  </div>

                  <div className="activity-message">{activity.message}</div>

                  <div className="activity-meta">
                    {activity.commits && (
                      <span className="meta-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {activity.commits} commit{activity.commits > 1 ? 's' : ''}
                      </span>
                    )}
                    {activity.branch && (
                      <span className="meta-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="6" y1="3" x2="6" y2="15" />
                          <circle cx="18" cy="6" r="3" />
                          <circle cx="6" cy="18" r="3" />
                          <path d="M18 9a9 9 0 0 1-9 9" />
                        </svg>
                        {activity.branch}
                      </span>
                    )}
                    {activity.status && (
                      <span className={`meta-badge status-${activity.status}`}>
                        {activity.status}
                      </span>
                    )}
                    {activity.additions && activity.deletions && (
                      <span className="meta-badge">
                        <span className="additions">+{activity.additions}</span>
                        <span className="deletions">-{activity.deletions}</span>
                      </span>
                    )}
                    {activity.language && (
                      <span className="meta-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                        {activity.language}
                      </span>
                    )}
                    {activity.comments && (
                      <span className="meta-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {activity.comments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="activity-footer">
        <a
          href="https://github.com/alexhaloETH"
          target="_blank"
          rel="noopener noreferrer"
          className="view-github-btn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          View Full GitHub Profile
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default GitHubActivityCard;
