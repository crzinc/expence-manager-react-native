//HomeScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    // Load stored budgets when the app starts
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

    loadBudgets();
  }, []);

  useEffect(() => {
    // Load stored budgets and transactions when the app starts
    const loadData = async () => {
      try {
        const storedBudgets = await AsyncStorage.getItem('budgets');
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        }
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // Dummy data for testing
  useEffect(() => {
    setTransactions([
      {
        id: '1',
        description: 'Покупка кофе',
        category: 'Еда',
        amount: '200',
      },
      {
        id: '2',
        description: 'Проезд на метро',
        category: 'Транспорт',
        amount: '50',
      }
    ]);
    setBudgets([
      { category: 'Еда', limit: 2000, spent: 200 },
      { category: 'Транспорт', limit: 1000, spent: 50 }
    ]);
  }, []);

  const handleAddBudget = (newBudget) => {
    setBudgets(prevBudgets => [...prevBudgets, newBudget]);
  };

  // Animation
  const scaleValue = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Управление доходами и расходами</Text>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity style={styles.button} onPress={() => {
          animateButton();
          navigation.navigate('AddTransaction', {
            addTransaction: (newTransaction) => setTransactions([...transactions, newTransaction])
          });
        }}>
          <Text style={styles.buttonText}>Добавить транзакцию</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity style={styles.button} onPress={() => {
          animateButton();
          navigation.navigate('Budget', {
            budgets,
            addBudget: handleAddBudget
          });
        }}>
          <Text style={styles.buttonText}>Управление бюджетами</Text>
        </TouchableOpacity>
      </Animated.View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View style={styles.transactionDetails}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.amount}>{item.amount} ₼</Text>
            </View>
            <View style={styles.transactionActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => setTransactions(transactions.filter(transaction => transaction.id !== item.id))}>
                <Text style={styles.deleteButton}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditTransaction', {
                transaction: item,
                updateTransaction: (updatedTransaction) => setTransactions(transactions.map(transaction => transaction.id === updatedTransaction.id ? updatedTransaction : transaction))
              })}>
                <Text style={styles.editButton}>Редактировать</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transaction: {
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
  transactionDetails: {
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    marginHorizontal: 8,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  editButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
