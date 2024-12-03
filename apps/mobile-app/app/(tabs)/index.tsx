import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const initialSavingsGoals: Goal[] = [];

export default function HomeScreen() {
  const [savingsGoals, setSavingsGoals] = useState<Goal[]>(initialSavingsGoals);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useColorScheme(); // Access the current theme

  const addGoal = useCallback(() => {
    if (newGoal && targetAmount && timeFrame) {
      const newGoalObj: Goal = {
        id: (savingsGoals.length + 1).toString(),
        goal: newGoal,
        progress: 0,
        targetAmount: parseInt(targetAmount, 10),
        timeFrame: parseInt(timeFrame, 10),
      };
      setSavingsGoals((prevGoals) => [...prevGoals, newGoalObj]);
      setModalVisible(false);
      setNewGoal('');
      setTargetAmount('');
      setTimeFrame('');
    } else {
      Alert.alert('Error', 'Please enter all fields for the goal.');
    }
  }, [newGoal, targetAmount, timeFrame, savingsGoals]);

  const EmptyListPlaceholder = () => (
    <View style={styles.emptyListContainer}>
      <Text style={[styles.emptyListText, { color: Colors[theme].text }]}>
        No goals added yet.
      </Text>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: Colors[theme].buttonBackground },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.addButtonText, { color: Colors[theme].buttonText }]}
        >
          Add New Goal
        </Text>
      </TouchableOpacity>
    </View>
  );

  const GoalItem = ({ goal }: { goal: Goal }) => (
    <Swipeable>
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
        ListEmptyComponent={<EmptyListPlaceholder />}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}
      />
      {savingsGoals.length > 0 && (
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: Colors[theme].buttonBackground },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[styles.addButtonText, { color: Colors[theme].buttonText }]}
          >
            Add New Goal
          </Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" visible={modalVisible}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: Colors[theme].background },
          ]}
        >
          <TextInput
            placeholder="Goal Name"
            placeholderTextColor={Colors[theme].placeholder}
            value={newGoal}
            onChangeText={setNewGoal}
            style={[
              styles.input,
              {
                borderColor: Colors[theme].inputBorder,
                color: Colors[theme].text,
              },
            ]}
          />
          <TextInput
            placeholder="Target Amount"
            placeholderTextColor={Colors[theme].placeholder}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                borderColor: Colors[theme].inputBorder,
                color: Colors[theme].text,
              },
            ]}
          />
          <TextInput
            placeholder="Time Frame (months)"
            placeholderTextColor={Colors[theme].placeholder}
            value={timeFrame}
            onChangeText={setTimeFrame}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                borderColor: Colors[theme].inputBorder,
                color: Colors[theme].text,
              },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[theme].buttonBackground },
            ]}
            onPress={addGoal}
          >
            <Text
              style={[
                styles.addButtonText,
                { color: Colors[theme].buttonText },
              ]}
            >
              Add Goal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              styles.cancelButton,
              { backgroundColor: Colors[theme].cancelButton },
            ]}
            onPress={() => setModalVisible(false)}
          >
            <Text
              style={[
                styles.addButtonText,
                { color: Colors[theme].buttonText },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  emptyListContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalItem: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 80,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
  },
});
