import { TYPE_LABELS } from '../GitHubActivityCard.constants';
import { generateRepoColor, getRelativeTime } from '../GitHubActivityCard.utils';

function RepoGroupItem({ group }) {
  const summary = Object.entries(group.types)
    .map(([type, count]) => `${count} ${TYPE_LABELS[type]}${count > 1 ? 'es' : ''}`)
    .join(', ');

  const latestActivity = group.activities[0];
  const repoUrl = `https://github.com/${group.repo}`;
  const repoColor = generateRepoColor(group.repo);

  return (
    <div
      className="repo-group-item"
      style={{ '--repo-color': repoColor }}
    >
      <div className="repo-group-header">
        <div className="repo-info">
          <svg className="repo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-name"
            onClick={(e) => e.stopPropagation()}
          >
            {group.repo}
          </a>
        </div>
        <span className="repo-time">{getRelativeTime(group.timestamp)}</span>
      </div>

      <div className="repo-summary">{summary}</div>

      <div className="repo-meta">
        {latestActivity.branch && (
          <span className="meta-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            {latestActivity.branch}
          </span>
        )}
        {latestActivity.sha && (
          <span className="meta-badge commit-sha" title={`Latest commit: ${latestActivity.sha}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="21" y2="12" />
            </svg>
            {latestActivity.sha.substring(0, 7)}
          </span>
        )}
        {latestActivity.compareUrl && (
          <a
            href={latestActivity.compareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meta-badge view-commits"
            onClick={(e) => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View commits
          </a>
        )}
      </div>
    </div>
  );
}

export default RepoGroupItem;
