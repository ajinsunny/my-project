import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';

interface Goal {
  id: string;
  goal: string;
  progress: number;
  targetAmount: number;
  timeFrame: number;
  suggestedSavings?: number;
}

interface SavingsContextType {
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
  savingsGoals: Goal[];
  setSavingsGoals: (goals: Goal[]) => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [savingsGoals, setSavingsGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const storedIncome = await AsyncStorage.getItem(STORAGE_KEYS.MONTHLY_INCOME);
      if (storedIncome) setMonthlyIncome(parseFloat(storedIncome));

      const storedGoals = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      if (storedGoals) setSavingsGoals(JSON.parse(storedGoals));
    };
    loadInitialData();
  }, []);

  // Persist data when income or goals are updated
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.MONTHLY_INCOME, monthlyIncome.toString());
  }, [monthlyIncome]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  return (
    <SavingsContext.Provider
      value={{ monthlyIncome, setMonthlyIncome, savingsGoals, setSavingsGoals }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) throw new Error('useSavings must be used within a SavingsProvider');
  return context;
};
