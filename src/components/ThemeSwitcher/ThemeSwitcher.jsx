import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeSwitcher.css';

function ThemeSwitcher() {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleThemeSelect = (themeId) => {
    switchTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeName = availableThemes.find(t => t.id === currentTheme)?.name || 'Dark';

  return (
    <div className="theme-switcher" ref={dropdownRef}>
      <button
        className="theme-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change color theme"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
        </svg>
        <span className="theme-name">{currentThemeName}</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <span className="theme-option-name">{theme.name}</span>
              {currentTheme === theme.id && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
