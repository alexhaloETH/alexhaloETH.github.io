// The Inventory. Each group renders as a game window full of item slots.
// `icon` is a key in brandIcons.js; items without one get a pixel monogram instead.
//
// Layout: on tablets the first group spans the full row and the rest pair up, so keep
// the biggest group first and an even number after it. On desktop each group grows in
// proportion to its item count, so slots match in size and rows fill edge to edge.

export const inventory = [
  {
    id: 'languages',
    title: 'Languages',
    items: [
      { name: 'C#', icon: 'csharp' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'C++', icon: 'cplusplus' },
      { name: 'Python', icon: 'python' },
      { name: 'Cairo', mono: 'Ca' },
    ],
  },
  {
    id: 'engines',
    title: 'Engines',
    items: [
      { name: 'Unity', icon: 'unity' },
      { name: 'Unreal', icon: 'unrealengine' },
    ],
  },
  {
    id: 'web',
    title: 'Web',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'HTML', icon: 'html5' },
      { name: 'GraphQL', icon: 'graphql' },
    ],
  },
  {
    id: 'onchain',
    title: 'Onchain',
    items: [
      { name: 'Starknet', mono: 'Sn' },
      { name: 'Dojo', mono: 'Dj' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'Blender', icon: 'blender' },
      { name: 'Figma', icon: 'figma' },
    ],
  },
];

// The "Leveling up" window: what you are learning now, or getting better at.
// Give each item either `icon` (a brandIcons.js key) or `pixels` (a PixelIcon name).
export const levelingUp = {
  title: 'Leveling up',
  intro: "What I'm learning right now, or getting better at.",
  items: [
    {
      id: 'rust',
      title: 'Rust',
      detail: "Learning it now. My old site's backend was my excuse to start.",
      icon: 'rust',
    },
    {
      id: 'procgen',
      title: 'Procedural generation',
      detail: 'Getting better at it, ever since Dungeon Forge and my dissertation.',
      pixels: 'dungeon',
    },
    {
      id: 'editor-tools',
      title: 'Editor tools',
      detail: "Getting better at Unity editor extensions, like Dungeon Forge's node-graph rule builder.",
      pixels: 'wrench',
    },
  ],
};
