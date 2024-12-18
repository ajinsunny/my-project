import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Swipeable } from 'react-native-gesture-handler';
import { STORAGE_KEYS } from '@/constants/storageKeys';

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

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [newGoalName, setNewGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const storedGoals = await AsyncStorage.getItem(
        STORAGE_KEYS.SAVINGS_GOALS
      );
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals) as Goal[];
        setSavingsGoals(recalculateSuggestedSavings(parsedGoals));
      }

      const storedIncome = await AsyncStorage.getItem(
        STORAGE_KEYS.MONTHLY_INCOME
      );
      if (storedIncome) {
        setMonthlyIncome(parseFloat(storedIncome));
      }
    };
    loadData();
  }, []);

  const saveGoalsToStorage = async (goals: Goal[]) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVINGS_GOALS,
      JSON.stringify(goals)
    );
  };

  const recalculateSuggestedSavings = (goals: Goal[]): Goal[] => {
    return goals.map((g) => {
      const suggested =
        g.targetAmount && g.timeFrame ? g.targetAmount / g.timeFrame : 0;
      return { ...g, suggestedSavings: suggested };
    });
  };

  const getTotalMonthlySavings = (goals: Goal[]): number => {
    return goals.reduce((sum, g) => sum + (g.suggestedSavings || 0), 0);
  };

  const handleDeleteGoal = async (id: string) => {
    const updatedGoals = savingsGoals.filter((g) => g.id !== id);
    setSavingsGoals(updatedGoals);
  
    // Save updated empty goals list to AsyncStorage
    await saveGoalsToStorage(updatedGoals);
    console.log('Goals after deletion:', updatedGoals); // Debug log
  };

  const validateGoalInput = (): boolean => {
    if (!newGoalName || !targetAmount || !timeFrame) {
      Alert.alert('Error', 'Please fill out all fields.');
      return false;
    }

    const tAmount = parseFloat(targetAmount);
    const tFrame = parseInt(timeFrame, 10);

    if (isNaN(tAmount) || tAmount <= 0 || isNaN(tFrame) || tFrame <= 0) {
      Alert.alert(
        'Error',
        'Target amount and time frame must be positive numbers.'
      );
      return false;
    }

    return true;
  };

  const canAffordGoal = (
    goals: Goal[],
    newGoal: Goal,
    isEditing = false
  ): boolean => {
    const income = monthlyIncome; // Use latest income from context
    const monthlyNeededForNewGoal = newGoal.targetAmount / newGoal.timeFrame;
  
    const otherGoals = isEditing
      ? goals.filter((g) => g.id !== newGoal.id)
      : goals;
  
    const sumOfOthers = getTotalMonthlySavings(otherGoals);
    const leftover = income - sumOfOthers;
  
    if (monthlyNeededForNewGoal > leftover) {
      Alert.alert(
        'You cannot afford it!',
        'This goal cannot be afforded given your current income and other goals.'
      );
      return false;
    }
    return true;
  };
  

  const handleAddGoal = async () => {
    if (!validateGoalInput()) return;

    const newGoal: Goal = {
      id: (savingsGoals.length + 1).toString(),
      goal: newGoalName,
      progress: 0,
      targetAmount: parseFloat(targetAmount),
      timeFrame: parseInt(timeFrame, 10),
    };

    if (!canAffordGoal(savingsGoals, monthlyIncome, newGoal)) {
      return; // Cannot afford this goal
    }

    const updatedGoals = recalculateSuggestedSavings([
      ...savingsGoals,
      newGoal,
    ]);
    setSavingsGoals(updatedGoals);
    await saveGoalsToStorage(updatedGoals);
    closeModal();
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewGoalName(goal.goal);
    setTargetAmount(goal.targetAmount.toString());
    setTimeFrame(goal.timeFrame.toString());
    setEditMode(true);
    setModalVisible(true);
  };

  const saveEditedGoal = async () => {
    if (!selectedGoal || !validateGoalInput()) return;

    const editedGoal: Goal = {
      ...selectedGoal,
      goal: newGoalName,
      targetAmount: parseFloat(targetAmount),
      timeFrame: parseInt(timeFrame, 10),
    };

    if (!canAffordGoal(savingsGoals, monthlyIncome, editedGoal, true)) {
      return; // Cannot afford the edited goal
    }

    const editedGoals = savingsGoals.map((g) =>
      g.id === selectedGoal.id ? editedGoal : g
    );

    const updatedGoals = recalculateSuggestedSavings(editedGoals);
    setSavingsGoals(updatedGoals);
    await saveGoalsToStorage(updatedGoals);
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewGoalName('');
    setTargetAmount('');
    setTimeFrame('');
    setEditMode(false);
    setSelectedGoal(null);
  };

  const GoalItem = ({ goal }: { goal: Goal }) => {
    const swipeableRef = useRef<Swipeable>(null);

    const renderRightActions = () => (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: Colors[theme].buttonBackground },
          ]}
          onPress={() => handleEditGoal(goal)}
        >
          <Text
            style={[styles.actionText, { color: Colors[theme].buttonText }]}
          >
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
          onPress={() => handleDeleteGoal(goal.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
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

  const renderListFooter = () => {
    // Footer always shows Add Goal button, allowing multiple additions
    if (savingsGoals.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[theme].buttonBackground },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={[
                styles.addButtonText,
                { color: Colors[theme].buttonText },
              ]}
            >
              Add Another Goal
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}
    >
      {savingsGoals.length === 0 ? (
        // Show No Goals state
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: Colors[theme].text }]}>
            No Goals Added
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[theme].buttonBackground },
            ]}
            onPress={() => setModalVisible(true)}
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
        </View>
      ) : (
        // Show FlatList if there are goals
        <>
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
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            ListFooterComponent={renderListFooter()}
          />
        </>
      )}

      {/* Modal for adding/editing a goal */}
      <Modal animationType="slide" visible={modalVisible}>
        <KeyboardAvoidingView
          style={[
            styles.modalContainer,
            { backgroundColor: Colors[theme].background },
          ]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            placeholder="Goal Name"
            placeholderTextColor={Colors[theme].placeholder}
            value={newGoalName}
            onChangeText={setNewGoalName}
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
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
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
            keyboardType="numeric"
            value={timeFrame}
            onChangeText={setTimeFrame}
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
            onPress={editMode ? saveEditedGoal : handleAddGoal}
          >
            <Text
              style={[
                styles.addButtonText,
                { color: Colors[theme].buttonText },
              ]}
            >
              {editMode ? 'Save Changes' : 'Add Goal'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[theme].cancelButton, marginTop: 10 },
            ]}
            onPress={closeModal}
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
        </KeyboardAvoidingView>
      </Modal>
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
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
