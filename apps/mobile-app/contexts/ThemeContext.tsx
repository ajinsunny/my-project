import React, { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';
type ThemeContextValue = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const THEME_KEY = 'user-theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    };

    fetchTheme();

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if user hasn't chosen a theme explicitly.
      AsyncStorage.getItem(THEME_KEY).then((storedTheme) => {
        if (
          !storedTheme &&
          (colorScheme === 'light' || colorScheme === 'dark')
        ) {
          setTheme(colorScheme);
        }
      });
    });

    return () => {
      listener.remove();
    };
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem(THEME_KEY, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
