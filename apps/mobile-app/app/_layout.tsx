import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, StyleSheet, Switch } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, toggleTheme } = useColorScheme(); // Destructure the toggleTheme function
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: true, // Make sure the header is visible
            headerRight: () => (
              <View style={styles.toggleButton}>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'} // Thumb color
                  trackColor={{ false: '#767577', true: '#81b0ff' }} // Track color
                />
              </View>
            ),
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    marginRight: 15,
    paddingVertical: 10,
  },
});
