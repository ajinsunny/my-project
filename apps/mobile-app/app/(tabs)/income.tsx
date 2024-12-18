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
import { useSavings } from '@/contexts/SavingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function IncomeScreen() {
  const { monthlyIncome, setMonthlyIncome, savingsGoals } = useSavings();
  const [inputIncome, setInputIncome] = useState<string>(monthlyIncome.toString());
  const { theme } = useColorScheme();

  useEffect(() => {
    setInputIncome(monthlyIncome.toString()); // Sync input field with context
  }, [monthlyIncome]);

  const getTotalMonthlySavings = () => {
    return savingsGoals.reduce((sum, g) => {
      const savings =
        g.targetAmount && g.timeFrame ? g.targetAmount / g.timeFrame : 0;
      return sum + savings;
    }, 0);
  };

  const saveMonthlyIncome = () => {
    const incomeNum = parseFloat(inputIncome);
    const totalMonthlySavings = getTotalMonthlySavings();

    if (isNaN(incomeNum) || incomeNum <= 0) {
      Alert.alert('Error', 'Please enter a valid positive income.');
      return;
    }

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

    setMonthlyIncome(incomeNum); // Update context immediately
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
        value={inputIncome}
        onChangeText={setInputIncome}
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
