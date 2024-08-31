import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Dummy data for testing
  const sampleBudgets = [
    { category: 'Еда', limit: 2000, spent: 0 },
    { category: 'Транспорт', limit: 1000, spent: 0 }
  ];

  // Dummy data for testing
  const sampleTransactions = [
    {
      id: '1',
      description: 'Покупка кофе',
      category: 'Еда',
      amount: '200',
      photo: 'https://via.placeholder.com/100'
    },
    {
      id: '2',
      description: 'Проезд на метро',
      category: 'Транспорт',
      amount: '50',
      photo: 'https://via.placeholder.com/100'
    }
  ];

  // Populate with sample data
  useEffect(() => {
    setTransactions(sampleTransactions);
    setBudgets(sampleBudgets);
  }, []);

  const handleDelete = (id) => {
    const deletedTransaction = transactions.find(transaction => transaction.id === id);
    setTransactions(transactions.filter(transaction => transaction.id !== id));

    if (deletedTransaction) {
      setBudgets(budgets.map(budget =>
        budget.category === deletedTransaction.category
          ? { ...budget, spent: budget.spent - parseFloat(deletedTransaction.amount) }
          : budget
      ));
    }
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    setBudgets(budgets.map(budget =>
      budget.category === newTransaction.category
        ? { ...budget, spent: budget.spent + parseFloat(newTransaction.amount) }
        : budget
    ));
  };

  const handleEditTransaction = useCallback((updatedTransaction) => {
    const previousTransaction = transactions.find(transaction => transaction.id === updatedTransaction.id);

    if (previousTransaction) {
      setTransactions(transactions.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      ));

      setBudgets(budgets.map(budget =>
        budget.category === updatedTransaction.category
          ? { ...budget, spent: budget.spent + parseFloat(updatedTransaction.amount) - parseFloat(previousTransaction.amount) }
          : budget
      ));
    }
  }, [transactions, budgets]);

  const handleAddBudget = (newBudget) => {
    setBudgets([...budgets, newBudget]);
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
            addTransaction: handleAddTransaction
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
              <Text style={styles.amount}>{item.amount} ₽</Text>
              {item.photo && <Image source={{ uri: item.photo }} style={styles.image} />}
            </View>
            <View style={styles.transactionActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditTransaction', {
                transaction: item,
                updateTransaction: handleEditTransaction
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
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
