import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const AddTransactionScreen = ({ route, navigation }) => {
  const { addTransaction } = route.params;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { label: 'Еда', value: 'Еда' },
    { label: 'Транспорт', value: 'Транспорт' },
    { label: 'Развлечения', value: 'Развлечения' },
    { label: 'Шопинг', value: 'Шопинг' },
    { label: 'Прочее', value: 'Прочее' }
  ];

  const handleSave = () => {
    if (description && amount && category) {
      addTransaction({
        id: Math.random().toString(),
        description,
        category,
        amount,
      });
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
        items={categories}
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
