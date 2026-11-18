// Newest first. `start` and `end` are "YYYY-MM" so they can go straight into <time>.
// Set `latest: true` on the role that should lead the level path.

export const experience = [
  {
    id: 'grugs-lair',
    role: 'CTO and co-founder',
    org: "Grug's Lair Limited",
    start: '2023-10',
    end: '2026-06',
    summary:
      'Technical lead for a mobile-first onchain game studio. I owned engineering across the game client, web stack and Starknet contracts, focused on shipping production gameplay, smooth onboarding and live operations that scale.',
    link: { label: 'Blob Arena, the title we shipped', href: '#blob-arena-title' },
    latest: true,
  },
  {
    id: 'uwe',
    role: 'Games Technology',
    org: 'UWE Bristol',
    start: '2021-02',
    end: '2023-08',
    summary: 'Gameplay programming and procedural content generation.',
    points: [
      'Outstanding TIGA Graduate of the Year, Games Technology.',
      'First-class dissertation on procedural generation techniques in Unity.',
      'Prototypes with AI-driven systems, custom tools and Unity editor extensions.',
    ],
  },
  {
    id: 'self-taught',
    role: 'Self-taught game developer',
    org: 'Digital agency and personal projects',
    start: '2020-03',
    end: '2021-09',
    summary: 'Taught myself Unity and programming by building small games, tools and interactive prototypes.',
    points: [
      'Unity prototypes exploring movement and basic combat.',
      'Git and team workflow: branching, code review and issue tracking.',
    ],
  },
];
