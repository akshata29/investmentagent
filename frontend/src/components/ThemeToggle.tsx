import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'fixed' | 'inline';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'fixed' 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const buttonClass = variant === 'inline' 
    ? `theme-toggle-inline ${className}` 
    : `theme-toggle ${className}`;

  return (
    <button
      onClick={toggleTheme}
      className={buttonClass}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Current theme: ${theme}. Click to switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3V1m0 22v-2m9-9h2M1 12h2m15.364-6.364l1.414-1.414M4.222 19.778l1.414-1.414m12.728 0l1.414 1.414M4.222 4.222l1.414 1.414M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
};
