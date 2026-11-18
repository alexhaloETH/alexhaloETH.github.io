// Selected work. The first project is the featured one and gets the big card.
// Media paths are relative to /public. Give every image its real width and height
// so the page does not jump while it loads.

export const featured = {
  id: 'blob-arena',
  title: 'Blob Arena',
  role: "CTO and co-founder, Grug's Lair",
  status: 'Shipped',
  period: 'Live late 2025 to June 2026',
  summary:
    'A pixel-art, turn-based battler that ran fully onchain on Starknet. Players collected Bloberts, pushed Arcade runs and duelled in PvP across Classic and AMMA modes.',
  highlights: [
    'Owned engineering end to end: the Unity client, the web stack and the Starknet contracts in Cairo.',
    'Built onboarding for people who had never touched crypto, with Discord and passkey sign-in through Cartridge.',
    'Shipped live competitive events, including the Armored MMA launch at Hall of Fame Village, with tournaments and seasonal prizes.',
  ],
  stack: ['Unity', 'C#', 'Cairo', 'Starknet', 'Dojo', 'Cartridge', 'React', 'TypeScript'],
  link: {
    label: 'Read the Bankless feature',
    href: 'https://www.bankless.com/read/enter-the-blob-arena',
  },
  media: [
    {
      src: '/media/blob-arena-key-art.webp',
      width: 498,
      height: 393,
      alt: 'Blob Arena key art: pixel-art fighters in front of a colosseum',
      kind: 'main',
    },
    {
      src: '/media/blob-arena-duel.webp',
      width: 498,
      height: 393,
      alt: 'A PvP duel between two knights in a town square, with HP and stat bars',
      kind: 'side',
    },
    {
      src: '/media/blob-arena-mobile.webp',
      width: 184,
      height: 385,
      alt: 'The mobile battle screen with Fight, Bag, Info and Run actions',
      kind: 'phone',
    },
  ],
};

export const dungeonForge = {
  id: 'dungeon-forge',
  title: 'Dungeon Forge',
  role: 'Unity editor toolkit for procedural dungeons',
  status: 'Open source, MIT',
  period: '2023',
  paragraphs: [
    'Generates 2D dungeon layouts with a dozen PCG algorithms, from Voronoi, L-systems and Perlin worms to cellular automata, BSP rooms and Delaunay triangulation, then builds them out in 3D from weighted tilesets.',
    'Also handles chunk-based loading, mesh generation with Blender export, and wave function collapse with a node-graph rule builder.',
  ],
  link: { label: 'View the code', href: 'https://github.com/alexhaloETH/Dungeon-Forge' },
  video: {
    src: '/media/dungeon-forge.mp4',
    poster: '/media/dungeon-forge-poster.jpg',
    width: 480,
    height: 264,
    label: 'Dungeon Forge generating a dungeon in the Unity editor',
    caption: 'Generating a layout in the Unity editor. 11 seconds, no sound.',
  },
};

export const earlierWork = [
  { name: 'Squad AI', meta: 'Unity, C#', href: 'https://github.com/alexhaloETH/AT_SquadAI_Unity' },
  { name: 'Mesh destruction', meta: 'ShaderLab', href: 'https://github.com/alexhaloETH/Mesh_Destruction_AT' },
  { name: 'Sim game', meta: 'C#', href: 'https://github.com/alexhaloETH/Sim_Game_AT' },
];
