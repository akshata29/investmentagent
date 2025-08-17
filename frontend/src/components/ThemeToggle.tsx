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
  const { theme, cycleTheme, isDark } = useTheme();

  const buttonClass = variant === 'inline' 
    ? `theme-toggle-inline ${className}` 
    : `theme-toggle ${className}`;

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'customer' : 'light';

  return (
    <button
      onClick={cycleTheme}
      className={buttonClass}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Current theme: ${theme}. Click to switch to ${nextTheme} theme`}
    >
      {theme === 'light' && (
        // Moon icon indicates next is dark
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      {theme === 'dark' && (
        // Leaf icon indicates next is customer
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7 2 3 6 3 11c0 5 4 9 9 9s9-4 9-9c0-1-.2-2-.6-3-2 2-5 3-8 3-3.5 0-6.6-1.5-8.7-4 1.3-2.6 4-5 8.3-5h8v2h-6z"/>
        </svg>
      )}
      {theme === 'customer' && (
        // Sun icon indicates next is light
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3V1m0 22v-2m9-9h2M1 12h2m15.364-6.364l1.414-1.414M4.222 19.778l1.414-1.414m12.728 0l1.414 1.414M4.222 4.222l1.414 1.414M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
        </svg>
      )}
    </button>
  );
};
