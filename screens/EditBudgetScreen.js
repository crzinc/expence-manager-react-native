import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditBudgetScreen = ({ route, navigation }) => {
  const { budget, updateBudget } = route.params;
  const [category, setCategory] = useState(budget.category);
  const [limit, setLimit] = useState(budget.limit.toString());

  useEffect(() => {
    setCategory(budget.category);
    setLimit(budget.limit.toString());
  }, [budget]);

  const handleSave = async () => {
    if (category && limit) {
      const updatedBudget = {
        category,
        limit: parseFloat(limit),
        spent: budget.spent,
      };
      
      updateBudget(updatedBudget);

      try {
        const storedBudgets = await AsyncStorage.getItem('budgets');
        const budgets = storedBudgets ? JSON.parse(storedBudgets) : [];
        const updatedBudgets = budgets.map(b => b.category === updatedBudget.category ? updatedBudget : b);
        await AsyncStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      } catch (error) {
        console.error('Failed to save budgets:', error);
      }

      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редактировать бюджет</Text>
      <TextInput
        style={styles.input}
        placeholder="Категория"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Лимит"
        keyboardType="numeric"
        value={limit}
        onChangeText={setLimit}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditBudgetScreen;
