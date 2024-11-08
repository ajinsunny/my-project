import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard, // Import Keyboard for dismissing
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IncomeScreen() {
  const [monthlyIncome, setMonthlyIncome] = useState<string | null>(null);

  // Load monthly income from AsyncStorage when the screen loads
  useEffect(() => {
    const loadMonthlyIncome = async () => {
      const storedIncome = await AsyncStorage.getItem("monthlyIncome");
      if (storedIncome) {
        setMonthlyIncome(storedIncome);
      }
    };
    loadMonthlyIncome();
  }, []);

  // Save the monthly income to AsyncStorage
  const saveMonthlyIncome = async () => {
    if (monthlyIncome) {
      await AsyncStorage.setItem("monthlyIncome", monthlyIncome);
      Alert.alert("Success", "Monthly income updated successfully!");
      Keyboard.dismiss(); // Dismiss the keyboard after saving
    } else {
      Alert.alert("Error", "Please enter a valid income.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Close keyboard when touching outside */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Avoid covering input with keyboard
      >
        <Text style={styles.title}>Enter or Update Your Monthly Income</Text>
        <TextInput
          placeholder="Monthly Income"
          value={monthlyIncome ?? ""}
          onChangeText={setMonthlyIncome}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveMonthlyIncome}>
          <Text style={styles.saveButtonText}>Save Income</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
