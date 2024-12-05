import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Swipeable } from 'react-native-gesture-handler';

interface Goal {
  id: string;
  goal: string;
  progress: number;
  targetAmount: number;
  timeFrame: number;
  suggestedSavings?: number;
}

export default function HomeScreen() {
  const [savingsGoals, setSavingsGoals] = useState<Goal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useColorScheme();

  const GoalItem = ({ goal }: { goal: Goal }) => {
    const swipeableRef = useRef<Swipeable>(null);

    const handleDeleteGoal = (id: string) => {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    };

    const renderRightActions = () => (
      <View style={styles.rightActions}>
        {/* Implement Edit/Delete buttons here, using Colors[theme] for styling */}
      </View>
    );

    return (
      <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
        <View
          style={[
            styles.goalItem,
            { backgroundColor: Colors[theme].cardBackground },
          ]}
        >
          <Text style={[styles.goalText, { color: Colors[theme].text }]}>
            {goal.goal || 'Untitled Goal'}
          </Text>
          <Text style={[styles.savingsText, { color: Colors[theme].tint }]}>
            Suggested Monthly Savings: $
            {goal.suggestedSavings?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}
    >
      <FlatList
        data={savingsGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalItem goal={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(false)}
            tintColor={Colors[theme].tint}
          />
        }
        ListEmptyComponent={
          <Text style={{ color: Colors[theme].text }}>No goals added yet.</Text>
        }
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  goalItem: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
    height: 80,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsText: {
    fontSize: 14,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
