import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'customer';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'customer';
      return 'light';
    });
  };

  const isDark = theme === 'dark';

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme class to body for global styling
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, cycleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
