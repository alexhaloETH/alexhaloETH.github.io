export const experiences = [
  {
    id: 1,
    title: "Blockchain Developer",
    company: "Web3 Startup",
    icon: "🚀",
    startDate: new Date(2023, 0), // January 2023
    endDate: null, // Present
    description: "Building decentralized applications and smart contracts. Working with Solidity, Ethereum, and various Web3 technologies.",
    highlights: [
      "Deployed 15+ smart contracts managing $2M+ in assets",
      "Reduced gas costs by 40% through optimization",
      "Led team of 3 junior developers"
    ],
    skills: ["Solidity", "Ethereum", "React", "Web3.js", "Smart Contracts"],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Tech Company",
    icon: "💻",
    startDate: new Date(2021, 1), // February 2021
    endDate: new Date(2023, 0), // January 2023
    description: "Developed scalable web applications with React and Node.js. Led frontend architecture decisions.",
    highlights: [
      "Improved application performance by 60%",
      "Architected microservices handling 100K+ daily users",
      "Mentored 5 junior developers"
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    id: 3,
    title: "Junior Developer",
    company: "Digital Agency",
    icon: "🎨",
    startDate: new Date(2020, 2), // March 2020
    endDate: new Date(2021, 1), // February 2021
    description: "Created responsive websites and web applications. Learned modern development practices.",
    highlights: [
      "Built 20+ responsive client websites",
      "Achieved 98% client satisfaction rating",
      "Reduced page load times by 50%"
    ],
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
  },
];

export const TIMELINE_START_YEAR = 2020;
export const TIMELINE_END_YEAR = new Date().getFullYear();
