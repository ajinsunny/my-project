import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { STORAGE_KEYS } from '@/constants/storageKeys';

interface Goal {
  id: string;
  goal: string;
  progress: number;
  targetAmount: number;
  timeFrame: number;
  suggestedSavings?: number;
}

export default function IncomeScreen() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const { theme } = useColorScheme();

  useEffect(() => {
    const loadData = async () => {
      const storedIncome = await AsyncStorage.getItem(
        STORAGE_KEYS.MONTHLY_INCOME
      );
      if (storedIncome) {
        setMonthlyIncome(storedIncome);
      }

      const storedGoals = await AsyncStorage.getItem(
        STORAGE_KEYS.SAVINGS_GOALS
      );
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    };
    loadData();
  }, []);

  const getTotalMonthlySavings = () => {
    return goals.reduce((sum, g) => {
      const savings =
        g.targetAmount && g.timeFrame ? g.targetAmount / g.timeFrame : 0;
      return sum + savings;
    }, 0);
  };

  const saveMonthlyIncome = async () => {
    const incomeNum = parseFloat(monthlyIncome);
    if (isNaN(incomeNum) || incomeNum <= 0) {
      Alert.alert('Error', 'Please enter a valid positive income.');
      return;
    }

    const totalMonthlySavings = getTotalMonthlySavings();
    if (incomeNum < totalMonthlySavings) {
      Alert.alert(
        'Insufficient Income',
        `Your current goals require $${totalMonthlySavings.toFixed(
          2
        )} per month, which is more than your entered income of $${incomeNum.toFixed(
          2
        )}. Please increase your income or adjust your goals.`
      );
      return;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.MONTHLY_INCOME,
      incomeNum.toString()
    );
    Alert.alert('Success', 'Monthly income updated successfully!');
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={[styles.title, { color: Colors[theme].text }]}>
        What's your Income?
      </Text>
      <TextInput
        placeholder="Monthly Income"
        placeholderTextColor={Colors[theme].inputBorder}
        value={monthlyIncome}
        onChangeText={setMonthlyIncome}
        keyboardType="numeric"
        style={[
          styles.input,
          { borderColor: Colors[theme].inputBorder, color: Colors[theme].text },
        ]}
      />
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: Colors[theme].buttonBackground },
        ]}
        onPress={saveMonthlyIncome}
      >
        <Text
          style={[styles.saveButtonText, { color: Colors[theme].buttonText }]}
        >
          Save Income
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
