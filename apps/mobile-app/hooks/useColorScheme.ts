import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'user-theme';

export function useColorScheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark');
      } else {
        setTheme(Appearance.getColorScheme() || 'light');
      }
    };

    fetchTheme();

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (!theme && (colorScheme === 'light' || colorScheme === 'dark')) {
        setTheme(colorScheme);
      }
    });

    return () => {
      listener.remove();
    };
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem(THEME_KEY, newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
}
