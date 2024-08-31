import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBudgetScreen = ({ route, navigation }) => {
  const { addBudget, updateCategories } = route.params;
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSave = async () => {
    if (category && limit) {
      const newBudget = {
        category,
        limit: parseFloat(limit),
        spent: 0,
      };

      // Save new budget
      addBudget(newBudget);

      // Update categories
      try {
        const storedBudgets = await AsyncStorage.getItem('budgets');
        const budgets = storedBudgets ? JSON.parse(storedBudgets) : [];
        const updatedCategories = [...new Set([...budgets.map(b => b.category), category])];
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));

        // Call the updateCategories function from AddTransactionScreen
        if (updateCategories) {
          updateCategories(updatedCategories);
        }
      } catch (error) {
        console.error('Failed to save categories:', error);
      }

      navigation.goBack();
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить бюджет</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
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

export default AddBudgetScreen;
