//EditTransactionScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const EditTransactionScreen = ({ route, navigation }) => {
  const { budgets, addBudget } = route.params;

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
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBudget', { addBudget })}>
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
});

export default EditTransactionScreen;
