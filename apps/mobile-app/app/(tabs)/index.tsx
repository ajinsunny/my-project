import React, { useState, useCallback, useMemo, useRef } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable, RectButton } from "react-native-gesture-handler";

const initialSavingsGoals = [
  {
    id: "1",
    goal: "Emergency Fund",
    progress: 75,
    targetAmount: 1000,
    timeFrame: 12,
  },
  { id: "2", goal: "Laptop", progress: 27, targetAmount: 1200, timeFrame: 10 },
  {
    id: "3",
    goal: "Spring Break Trip",
    progress: 31,
    targetAmount: 800,
    timeFrame: 6,
  },
];

interface Goal {
  id: string;
  goal: string;
  progress: number;
  targetAmount: number;
  timeFrame: number;
  suggestedSavings?: number;
}

export default function HomeScreen() {
  const [savingsGoals, setSavingsGoals] = useState<Goal[]>(initialSavingsGoals);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Use a ref to track the currently open Swipeable
  const openSwipeableRef = useRef<Swipeable | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadMonthlyIncome = async () => {
        const storedIncome = await AsyncStorage.getItem("monthlyIncome");
        if (storedIncome) {
          setMonthlyIncome(storedIncome);
        }
      };
      loadMonthlyIncome();
    }, [])
  );

  const recalculateSuggestedSavings = useCallback(
    (goal: Goal): number => {
      if (!monthlyIncome || isNaN(parseFloat(monthlyIncome))) return 0;

      const income = parseFloat(monthlyIncome);
      const availableIncome = income * 0.2;

      const totalRequiredSavings = savingsGoals.reduce((total, currentGoal) => {
        return total + currentGoal.targetAmount / currentGoal.timeFrame;
      }, 0);

      const requiredSavings = goal.targetAmount / goal.timeFrame;
      const proportion = requiredSavings / totalRequiredSavings;

      return Math.min(requiredSavings, availableIncome * proportion);
    },
    [savingsGoals, monthlyIncome]
  );

  const updatedSavingsGoals = useMemo(() => {
    return savingsGoals.map((goal) => ({
      ...goal,
      suggestedSavings: recalculateSuggestedSavings(goal),
    }));
  }, [savingsGoals, recalculateSuggestedSavings]);

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
      setNewGoal("");
      setTargetAmount("");
      setTimeFrame("");
    } else {
      Alert.alert("Error", "Please enter all fields for the goal.");
    }
  }, [newGoal, targetAmount, timeFrame, savingsGoals]);

  const removeGoal = useCallback((id: string) => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () =>
          setSavingsGoals((prevGoals) =>
            prevGoals.filter((goal) => goal.id !== id)
          ),
        style: "destructive",
      },
    ]);
  }, []);

  const editGoal = useCallback((goal: Goal) => {
    setEditMode(true);
    setSelectedGoal(goal);
    setNewGoal(goal.goal);
    setTargetAmount(goal.targetAmount.toString());
    setTimeFrame(goal.timeFrame.toString());
    setModalVisible(true);
  }, []);

  const saveEditedGoal = useCallback(() => {
    if (selectedGoal && newGoal && targetAmount && timeFrame) {
      const updatedGoals = savingsGoals.map((goal) => {
        if (goal.id === selectedGoal.id) {
          const updatedGoal = {
            ...goal,
            goal: newGoal,
            targetAmount: parseInt(targetAmount, 10),
            timeFrame: parseInt(timeFrame, 10),
          };
          updatedGoal.suggestedSavings =
            recalculateSuggestedSavings(updatedGoal);
          return updatedGoal;
        }
        return goal;
      });
      setSavingsGoals(updatedGoals);
      setModalVisible(false);
      setEditMode(false);
      setSelectedGoal(null);
      setNewGoal("");
      setTargetAmount("");
      setTimeFrame("");
    } else {
      Alert.alert("Error", "Please fill all fields for the goal.");
    }
  }, [
    selectedGoal,
    newGoal,
    targetAmount,
    timeFrame,
    savingsGoals,
    recalculateSuggestedSavings,
  ]);

  // Swipeable right actions (edit and delete)
  const renderRightActions = (goal: Goal) => (
    <View style={styles.actionButtons}>
      <RectButton
        style={[styles.rightAction, styles.editButton]}
        onPress={() => editGoal(goal)}
      >
        <Text style={styles.actionText}>Edit</Text>
      </RectButton>
      <RectButton
        style={[styles.rightAction, styles.deleteButton]}
        onPress={() => removeGoal(goal.id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </RectButton>
    </View>
  );

  const GoalItem = ({ goal }: { goal: Goal }) => {
    const swipeableRef = useRef<Swipeable>(null);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => renderRightActions(goal)}
        onSwipeableWillOpen={() => {
          if (
            openSwipeableRef.current &&
            openSwipeableRef.current !== swipeableRef.current
          ) {
            openSwipeableRef.current.close();
          }
        }}
        onSwipeableOpen={() => {
          openSwipeableRef.current = swipeableRef.current;
        }}
        onSwipeableClose={() => {
          if (openSwipeableRef.current === swipeableRef.current) {
            openSwipeableRef.current = null;
          }
        }}
      >
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>{goal.goal || "Untitled Goal"}</Text>
          <Text style={styles.savingsText}>
            Suggested Monthly Savings: $
            {goal.suggestedSavings?.toFixed(2) || "0.00"}
          </Text>
        </View>
      </Swipeable>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    const recalculatedGoals = savingsGoals.map((goal) => ({
      ...goal,
      suggestedSavings: recalculateSuggestedSavings(goal),
    }));
    setSavingsGoals(recalculatedGoals);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={updatedSavingsGoals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GoalItem goal={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditMode(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Add New Goal</Text>
        </TouchableOpacity>

        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Goal Name"
              value={newGoal}
              onChangeText={setNewGoal}
              style={styles.input}
            />
            <TextInput
              placeholder="Target Amount"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Time Frame (months)"
              value={timeFrame}
              onChangeText={setTimeFrame}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={editMode ? saveEditedGoal : addGoal}
            >
              <Text style={styles.addButtonText}>
                {editMode ? "Save Changes" : "Add Goal"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// Updated styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  goalItem: {
    backgroundColor: "#ececec",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 80,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  savingsText: {
    fontSize: 14,
    color: "#007AFF",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});