const GITHUB_USERNAME = 'alexhaloETH';
const USE_REAL_API = true;

const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: 'push',
    repo: 'alexhaloETH/portfolio-website',
    message: 'Added skill tree visualization and GitHub feed',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    commits: 3,
    branch: 'main'
  },
  {
    id: 2,
    type: 'star',
    repo: 'anthropics/claude-code',
    message: 'Starred repository',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    stars: 1247
  },
  {
    id: 3,
    type: 'pull_request',
    repo: 'alexhaloETH/blockchain-explorer',
    message: 'Implement EVM transaction decoder',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'merged',
    additions: 234,
    deletions: 67
  },
  {
    id: 4,
    type: 'push',
    repo: 'alexhaloETH/defi-dashboard',
    message: 'Fixed liquidity pool calculation bug',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    commits: 2,
    branch: 'develop'
  },
  {
    id: 5,
    type: 'create',
    repo: 'alexhaloETH/web3-analytics',
    message: 'Created new repository',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    language: 'TypeScript'
  },
  {
    id: 6,
    type: 'issue',
    repo: 'alexhaloETH/smart-contracts',
    message: 'Opened issue: Gas optimization for batch transfers',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'open',
    comments: 4
  }
];

const TYPE_LABELS = {
  push: 'push',
  star: 'star',
  pull_request: 'PR',
  issue: 'issue',
  create: 'created'
};

export { GITHUB_USERNAME, MOCK_ACTIVITIES, TYPE_LABELS, USE_REAL_API };
