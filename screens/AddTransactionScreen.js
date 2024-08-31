import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTransactionScreen = ({ route, navigation }) => {
  const { addTransaction, updateBudgets } = route.params;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load categories from AsyncStorage
    const loadCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSave = async () => {
    if (description && amount && category) {
      // Add transaction
      addTransaction({
        id: Math.random().toString(),
        description,
        category,
        amount: parseFloat(amount),
      });

      // Update budget
      try {
        const storedBudgets = await AsyncStorage.getItem('budgets');
        if (storedBudgets) {
          const budgets = JSON.parse(storedBudgets);
          const updatedBudgets = budgets.map(budget => {
            if (budget.category === category) {
              return {
                ...budget,
                spent: budget.spent + parseFloat(amount),
              };
            }
            return budget;
          });

          await AsyncStorage.setItem('budgets', JSON.stringify(updatedBudgets));

          // Call the updateBudgets function from BudgetScreen
          if (updateBudgets) {
            updateBudgets(updatedBudgets);
          }
        }
      } catch (error) {
        console.error('Failed to update budgets:', error);
      }

      navigation.goBack();
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить транзакцию</Text>
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
      />
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'Выберите категорию...', value: null }}
        onValueChange={(value) => setCategory(value)}
        items={categories.map(cat => ({ label: cat, value: cat }))}
        value={category}
      />
      <TextInput
        style={styles.input}
        placeholder="Сумма"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
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

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIOS: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingRight: 30, // Adjust padding for the dropdown arrow
  },
  placeholder: {
    color: '#999',
  },
});

export default AddTransactionScreen;
