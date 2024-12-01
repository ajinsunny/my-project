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

export default function IncomeScreen() {
  const [monthlyIncome, setMonthlyIncome] = useState<string | null>(null);
  const { theme } = useColorScheme();

  useEffect(() => {
    const loadMonthlyIncome = async () => {
      const storedIncome = await AsyncStorage.getItem('monthlyIncome');
      if (storedIncome) {
        setMonthlyIncome(storedIncome);
      }
    };
    loadMonthlyIncome();
  }, []);

  const saveMonthlyIncome = async () => {
    if (monthlyIncome) {
      await AsyncStorage.setItem('monthlyIncome', monthlyIncome);
      Alert.alert('Success', 'Monthly income updated successfully!');
      Keyboard.dismiss();
    } else {
      Alert.alert('Error', 'Please enter a valid income.');
    }
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
        value={monthlyIncome ?? ''}
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
