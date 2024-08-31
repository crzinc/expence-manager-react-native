import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddExpenseScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');

  const { updateSpent } = route.params || {};

  const handleAddExpense = () => {
    if (amount) {
      updateSpent(amount);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить расход</Text>
      <TextInput
        style={styles.input}
        placeholder="Сумма"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Сохранить" onPress={handleAddExpense} />
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
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

export default AddExpenseScreen;
