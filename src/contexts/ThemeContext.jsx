import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  dark: {
    name: 'Dark',
    colors: {
      '--bg-primary': '#0a0a0a',
      '--bg-card': 'rgb(20 20 20 / 80%)',
      '--bg-card-solid': '#141414',
      '--border-color': '#2a2a2a',
      '--text-primary': '#fff',
      '--text-secondary': '#888',
      '--accent-color': '#4ade80',
      '--accent-pink': '#ec4899',
      '--accent-cyan': '#22d3ee',
    }
  },
  midnight: {
    name: 'Midnight Blue',
    colors: {
      '--bg-primary': '#0f1419',
      '--bg-card': 'rgb(25 35 50 / 80%)',
      '--bg-card-solid': '#192332',
      '--border-color': '#2d3748',
      '--text-primary': '#e2e8f0',
      '--text-secondary': '#94a3b8',
      '--accent-color': '#60a5fa',
      '--accent-pink': '#f472b6',
      '--accent-cyan': '#22d3ee',
    }
  },
  slate: {
    name: 'Slate',
    colors: {
      '--bg-primary': '#1e293b',
      '--bg-card': 'rgb(51 65 85 / 80%)',
      '--bg-card-solid': '#334155',
      '--border-color': '#475569',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#cbd5e1',
      '--accent-color': '#34d399',
      '--accent-pink': '#fb7185',
      '--accent-cyan': '#67e8f9',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      '--bg-primary': '#0c1821',
      '--bg-card': 'rgb(18 40 60 / 80%)',
      '--bg-card-solid': '#12283c',
      '--border-color': '#1e3a5f',
      '--text-primary': '#e0f2fe',
      '--text-secondary': '#7dd3fc',
      '--accent-color': '#2dd4bf',
      '--accent-pink': '#fb923c',
      '--accent-cyan': '#06b6d4',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      '--bg-primary': '#0d1b0d',
      '--bg-card': 'rgb(20 35 20 / 80%)',
      '--bg-card-solid': '#142314',
      '--border-color': '#2d4a2d',
      '--text-primary': '#e8f5e9',
      '--text-secondary': '#a5d6a7',
      '--accent-color': '#66bb6a',
      '--accent-pink': '#ffa726',
      '--accent-cyan': '#26c6da',
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      '--bg-primary': '#1a0f0a',
      '--bg-card': 'rgb(40 25 20 / 80%)',
      '--bg-card-solid': '#281914',
      '--border-color': '#4a352d',
      '--text-primary': '#fff5eb',
      '--text-secondary': '#ffccbc',
      '--accent-color': '#ff9800',
      '--accent-pink': '#ff5722',
      '--accent-cyan': '#ffc107',
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    colors: {
      '--bg-primary': '#0a0015',
      '--bg-card': 'rgb(25 0 40 / 80%)',
      '--bg-card-solid': '#190028',
      '--border-color': '#ff00ff',
      '--text-primary': '#00ffff',
      '--text-secondary': '#ff00ff',
      '--accent-color': '#00ffff',
      '--accent-pink': '#ff00ff',
      '--accent-cyan': '#00ff00',
    }
  },
  neon: {
    name: 'Neon Dreams',
    colors: {
      '--bg-primary': '#0d0221',
      '--bg-card': 'rgb(20 5 40 / 80%)',
      '--bg-card-solid': '#140528',
      '--border-color': '#7209b7',
      '--text-primary': '#f72585',
      '--text-secondary': '#b5179e',
      '--accent-color': '#f72585',
      '--accent-pink': '#7209b7',
      '--accent-cyan': '#4cc9f0',
    }
  },
  aurora: {
    name: 'Aurora',
    colors: {
      '--bg-primary': '#0a1128',
      '--bg-card': 'rgb(15 25 55 / 80%)',
      '--bg-card-solid': '#0f1937',
      '--border-color': '#2a4365',
      '--text-primary': '#e0f4ff',
      '--text-secondary': '#a8dadc',
      '--accent-color': '#4ade80',
      '--accent-pink': '#f72585',
      '--accent-cyan': '#4cc9f0',
    }
  },
  miami: {
    name: 'Miami Vice',
    colors: {
      '--bg-primary': '#1a0033',
      '--bg-card': 'rgb(35 0 70 / 80%)',
      '--bg-card-solid': '#230046',
      '--border-color': '#ff0080',
      '--text-primary': '#fff',
      '--text-secondary': '#ff0080',
      '--accent-color': '#00ffff',
      '--accent-pink': '#ff0080',
      '--accent-cyan': '#ff00ff',
    }
  },
  toxic: {
    name: 'Toxic',
    colors: {
      '--bg-primary': '#0a1a0a',
      '--bg-card': 'rgb(15 30 15 / 80%)',
      '--bg-card-solid': '#0f1e0f',
      '--border-color': '#39ff14',
      '--text-primary': '#e0ffe0',
      '--text-secondary': '#39ff14',
      '--accent-color': '#39ff14',
      '--accent-pink': '#ff1493',
      '--accent-cyan': '#00ffff',
    }
  },
  lava: {
    name: 'Lava',
    colors: {
      '--bg-primary': '#1a0000',
      '--bg-card': 'rgb(40 10 0 / 80%)',
      '--bg-card-solid': '#280a00',
      '--border-color': '#ff4500',
      '--text-primary': '#fff5e1',
      '--text-secondary': '#ff6347',
      '--accent-color': '#ff4500',
      '--accent-pink': '#ff1493',
      '--accent-cyan': '#ffd700',
    }
  },
  synthwave: {
    name: 'Synthwave',
    colors: {
      '--bg-primary': '#2b0d3d',
      '--bg-card': 'rgb(50 15 70 / 80%)',
      '--bg-card-solid': '#320f46',
      '--border-color': '#ff6ec7',
      '--text-primary': '#ffeeff',
      '--text-secondary': '#fe53bb',
      '--accent-color': '#08fdd8',
      '--accent-pink': '#fe53bb',
      '--accent-cyan': '#fd1d53',
    }
  },
  matrix: {
    name: 'Matrix',
    colors: {
      '--bg-primary': '#000000',
      '--bg-card': 'rgb(0 20 0 / 80%)',
      '--bg-card-solid': '#001400',
      '--border-color': '#00ff00',
      '--text-primary': '#00ff00',
      '--text-secondary': '#008f00',
      '--accent-color': '#00ff00',
      '--accent-pink': '#00ff00',
      '--accent-cyan': '#00ff41',
    }
  },
  electric: {
    name: 'Electric Blue',
    colors: {
      '--bg-primary': '#000a1f',
      '--bg-card': 'rgb(0 20 50 / 80%)',
      '--bg-card-solid': '#001432',
      '--border-color': '#00d9ff',
      '--text-primary': '#e0f7ff',
      '--text-secondary': '#00d9ff',
      '--accent-color': '#00d9ff',
      '--accent-pink': '#ff0099',
      '--accent-cyan': '#00ffff',
    }
  },
  galaxy: {
    name: 'Galaxy',
    colors: {
      '--bg-primary': '#0d0221',
      '--bg-card': 'rgb(20 5 50 / 80%)',
      '--bg-card-solid': '#140532',
      '--border-color': '#9d4edd',
      '--text-primary': '#e0aaff',
      '--text-secondary': '#c77dff',
      '--accent-color': '#7209b7',
      '--accent-pink': '#ff006e',
      '--accent-cyan': '#3a86ff',
    }
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Apply theme colors to CSS variables
    const theme = THEMES[currentTheme];
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      // Save to localStorage
      localStorage.setItem('theme', currentTheme);
    }
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    switchTheme,
    availableThemes: Object.keys(THEMES).map(key => ({
      id: key,
      name: THEMES[key].name
    }))
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
