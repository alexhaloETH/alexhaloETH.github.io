export const experiences = [
{
  id: 1,
  title: "CTO/Co-Founder",
  company: "Grug's Lair Limited",
  icon: "🚀",
  startDate: new Date(2023, 9),
  endDate: null, 
  description:
    "Technical lead for a mobile-first onchain game studio. I own end-to-end engineering (game client, web stack, and Starknet/Cairo contracts), with a focus on shipping production gameplay, smooth onboarding, and scalable live operations. Primary shipped title: Blob Arena — a fully onchain turn-based battler on Starknet, powered by Cartridge, with Classic + AMMA modes and competitive tournaments/leagues.",
  highlights: [
    "Shipped Blob Arena on Starknet (fully onchain turn-based battler), including Classic + AMMA modes and competitive PvP/Arcade experiences.",
    "Built/owned the onchain + client architecture and onboarding UX (e.g., Discord / passkey-style access) to make the game playable for mainstream users.",
    "Delivered live competitive rollouts tied to real-world events (Armored MMA / Hall of Fame Village launch) and supported tournament/seasonal prize operations.",
  ],
  skills: [
    "Unity",
    "C#",
    "Cairo",
    "StarkNet",
    "Dojo",
    "Cartridge",
    "React",
    "JS",
    "TS",
    "SQL",
    "Mobile",
  ],
},
 {
    id: 2,
    title: "Games Technology Student",
    company: "UWE Bristol",
    icon: "💻",
    startDate: new Date(2021, 1), // February 2021
    endDate: new Date(2023, 7), // August 2023
    description:
      "Studied Games Technology with a focus on gameplay programming and procedural content generation.",
    highlights: [
      "Outstanding TIGA Graduate of the Year - Games Technology",
      "Achieved a first in my dissertation on Procedural Generation techniques in Unity.",
      "Built multiple game prototypes using Unity, including AI-driven systems, custom tools, and unity editor extensions.",
    ],
    skills: [
      "Unity",
      "Procedural Generation",
      "C#",
      "Gameplay Programming",
      "Technical Design",
      "University",
    ],
  },
  {
    id: 3,
    title: "Self-Taught Game Developer",
    company: "Digital Agency / Personal Projects",
    icon: "🎨",
    startDate: new Date(2020, 2), // March 2020
    endDate: new Date(2021, 8), // September 2021
    description:
      "Started teaching myself Unity and programming, building small games, tools, and interactive prototypes while learning modern development workflows.",
    highlights: [
      "Built multiple Unity prototypes exploring core mechanics like movement and basic combat",
      "Learned version control (Git) and modern workflows, including branching, code reviews, and issue tracking.",
    ],
    skills: ["Unity", "Python", "JS", "Git", "Prototyping", "Self-Learning"],
  },
];

export const TIMELINE_START_YEAR = 2020;
export const TIMELINE_END_YEAR = new Date().getFullYear();
