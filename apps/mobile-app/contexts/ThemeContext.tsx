import React, { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeType = 'light' | 'dark';
type ThemeContextValue = {
  theme: ThemeType;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Determine the initial theme from the system preference
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<ThemeType>(
    systemTheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'light' || colorScheme === 'dark') {
        setTheme(colorScheme);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};
