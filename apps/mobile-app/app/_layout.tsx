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
import { useColorScheme } from '@/hooks/useColorScheme';

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
  const { theme, toggleTheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationThemeProvider
        value={theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}
      >
        <Stack
          screenOptions={{
            headerShown: true,
            headerRight: () => (
              <View style={styles.toggleButton}>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
              </View>
            ),
          }}
        >
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
