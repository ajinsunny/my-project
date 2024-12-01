import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Reusable icon component
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const { theme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme ?? 'light'].tint, // Use 'theme' here
        headerShown: false, // This hides the header for a more streamlined look
      }}
    >
      <Tabs.Screen
        name="index" // This is the home screen
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: 'Income',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'wallet' : 'wallet-outline'} // Updated icon for income
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
