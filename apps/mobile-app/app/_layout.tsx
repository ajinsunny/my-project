import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, Switch } from 'react-native';

import { AppThemeProvider } from '@/contexts/ThemeContext';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <RootLayoutWithTheme />
    </AppThemeProvider>
  );
}

function RootLayoutWithTheme() {
  const colorScheme = useColorScheme(); // returns 'light' | 'dark'
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationThemeProvider
        value={theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}
      >
        <Stack screenOptions={{}}>
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NavigationThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    marginRight: 15,
    paddingVertical: 10,
  },
});
