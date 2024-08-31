import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [forecast, setForecast] = useState([]);
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load stored transactions and budgets when the app starts
    const loadData = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        const storedBudgets = await AsyncStorage.getItem('budgets');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    calculateForecast();
  }, [transactions]);

  const calculateForecast = () => {
    if (transactions.length === 0) {
      setForecast([]);
      return;
    }

    const categories = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = [];
      }
      acc[transaction.category].push(transaction);
      return acc;
    }, {});

    const predictions = Object.keys(categories).map(category => {
      const categoryTransactions = categories[category];
      if (categoryTransactions.length === 0) return { category, prediction: 0 };

      const total = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const average = total / categoryTransactions.length;

      // Predicting for the rest of the month
      const now = moment();
      const daysInMonth = moment().daysInMonth();
      const daysLeft = daysInMonth - now.date();
      const forecastValue = average * daysLeft;

      return {
        category,
        prediction: forecastValue.toFixed(2),
      };
    });

    setForecast(predictions);
  };

  const animateButton = () => {
    Animated.spring(scaleValue, {
      toValue: 1.1,
      friction: 2,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start();
    });
  };

  // Calculate the total amount of transactions
  const getTotalAmount = () => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Управление доходами и расходами</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Общая сумма транзакций:</Text>
        <Text style={styles.totalAmount}>{getTotalAmount()} ₼</Text>
      </View>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity style={styles.button} onPress={() => {
          animateButton();
          navigation.navigate('AddTransaction', {
            addTransaction: (newTransaction) => {
              const updatedTransactions = [...transactions, newTransaction];
              setTransactions(updatedTransactions);
              AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            }
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
            addBudget: (newBudget) => {
              const updatedBudgets = [...budgets, newBudget];
              setBudgets(updatedBudgets);
              AsyncStorage.setItem('budgets', JSON.stringify(updatedBudgets));
            },
            updateBudgets: (updatedBudgets) => {
              setBudgets(updatedBudgets);
              AsyncStorage.setItem('budgets', JSON.stringify(updatedBudgets));
            }
          });
        }}>
          <Text style={styles.buttonText}>Управление бюджетами</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.forecastContainer}>
        <Text style={styles.forecastTitle}>Прогнозирование финансов</Text>
        {forecast.length > 0 ? (
          forecast.map(item => (
            <View key={item.category} style={styles.forecastItem}>
              <Text>{item.category}: {item.prediction} ₼ (прогноз)</Text>
            </View>
          ))
        ) : (
          <Text>Недостаточно данных для прогнозирования.</Text>
        )}
      </View>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  const updatedTransactions = transactions.filter(transaction => transaction.id !== item.id);
                  setTransactions(updatedTransactions);
                  AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
                }}
              >
                <Text style={styles.deleteButton}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('EditTransaction', {
                  transaction: item,
                  updateTransaction: (updatedTransaction) => {
                    const updatedTransactions = transactions.map(transaction =>
                      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                    );
                    setTransactions(updatedTransactions);
                    AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
                  }
                })}
              >
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
  totalContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 16,
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
  forecastContainer: {
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastItem: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 4,
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
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    color: '#333',
  },
  transactionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
