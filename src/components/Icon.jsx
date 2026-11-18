import { BRAND_ICONS } from '../data/brandIcons';

// UI icons, drawn on lucide's 24px grid with square caps to suit the pixel style.
const PATHS = {
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" />
      <path d="M4 16H2V2h14v2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  shipped: (
    <>
      <rect width="20" height="20" x="2" y="2" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  fork: (
    <>
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v3H6V9" />
      <path d="M12 12v3" />
    </>
  ),
  award: (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
};

export function Icon({ name, className = 'icon' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

export function DiscordIcon({ className = 'icon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function BrandIcon({ name, className = 'brand' }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg className={className} viewBox={icon.viewBox} fill="currentColor" aria-hidden="true" focusable="false">
      {icon.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

// Small pixel-art icons, one string per row, '#' is a filled pixel.
const BITMAPS = {
  arrow: ['#......', '###....', '#####..', '#######', '#####..', '###....', '#......'],
  play: ['##......', '####....', '######..', '########', '######..', '####....', '##......', '........'],
  pause: ['###..###', '###..###', '###..###', '###..###', '###..###', '###..###', '###..###', '###..###'],
  dungeon: ['########', '#..#...#', '#..#.#.#', '##...#.#', '#..###.#', '#.#....#', '#...##.#', '########'],
  wrench: ['.....#.#', '.....#.#', '....###.', '...###..', '..###...', '.###....', '###.....', '.#......'],
};

export function PixelIcon({ name, className = 'icon' }) {
  const rows = BITMAPS[name];
  const width = rows[0].length;
  const cells = [];
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === '#') cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    });
  });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${rows.length}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {cells}
    </svg>
  );
}

export function PixelArrow() {
  return <PixelIcon name="arrow" className="pixel-arrow" />;
}
