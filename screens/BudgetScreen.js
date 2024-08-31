import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetScreen = ({ route, navigation }) => {
  const [budgets, setBudgets] = useState([]);

  // Load budgets from AsyncStorage when the component mounts
  const loadBudgets = async () => {
    try {
      const storedBudgets = await AsyncStorage.getItem('budgets');
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error('Failed to load budgets:', error);
    }
  };

  // Save budgets to AsyncStorage
  const saveBudgets = async (updatedBudgets) => {
    try {
      await AsyncStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error('Failed to save budgets:', error);
    }
  };

  // Handle budget deletion
  const handleDeleteBudget = (category) => {
    const updatedBudgets = budgets.filter(budget => budget.category !== category);
    saveBudgets(updatedBudgets);
  };

  // Add a new budget and save it to AsyncStorage
  const handleAddBudget = (newBudget) => {
    const updatedBudgets = [...budgets, newBudget];
    saveBudgets(updatedBudgets);
  };

  // Navigate to the AddBudget screen with the handleAddBudget function
  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Управление бюджетами</Text>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <View style={styles.budget}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.limit}>Лимит: {item.limit} ₼</Text>
            <Text style={styles.spent}>Потрачено: {item.spent} ₼</Text>
            <Text style={styles.remaining}>Осталось: {item.limit - item.spent} ₼</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditBudget', {
                  budget: item,
                  updateBudget: (updatedBudget) => {
                    const updatedBudgets = budgets.map(b => 
                      b.category === updatedBudget.category ? updatedBudget : b
                    );
                    saveBudgets(updatedBudgets);
                  }
                })}
              >
                <Text style={styles.actionText}>Редактировать</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBudget(item.category)}
              >
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddBudget', { addBudget: handleAddBudget })}
      >
        <Text style={styles.buttonText}>Добавить бюджет</Text>
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
  budget: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  limit: {
    fontSize: 16,
    color: '#666',
  },
  spent: {
    fontSize: 16,
    color: '#333',
  },
  remaining: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BudgetScreen;
