import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export function useColorScheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within an AppThemeProvider');
  }
  return context; // { theme: 'light' | 'dark', toggleTheme: () => void }
}
