const getRelativeTime = (timestamp) => {
  const seconds = Math.floor((new Date() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

const formatUpdateTime = (lastUpdate) => {
  if (!lastUpdate) return '--:--';
  return lastUpdate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const generateRepoColor = (repoName) => {
  let hash = 0;
  for (let i = 0; i < repoName.length; i++) {
    hash = repoName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20);
  const lightness = 55 + (Math.abs(hash >> 8) % 15);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export { formatUpdateTime, generateRepoColor, getRelativeTime };
