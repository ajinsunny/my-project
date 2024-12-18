import { Tabs, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const { theme } = useColorScheme();
  const segments = useSegments();
  const navigation = useNavigation();

  useEffect(() => {
    // segments might look like: ['(tabs)', 'income'] or ['(tabs)', 'index']
    const currentTab = segments[segments.length - 1];

    let title = 'Home';
    if (currentTab === 'income') {
      title = 'Income';
    }

    navigation.setOptions({ title });
  }, [segments, navigation]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[theme].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
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
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'wallet' : 'wallet-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
