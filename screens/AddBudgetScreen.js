// AddBudgetScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddBudgetScreen = ({ route, navigation }) => {
  const { addBudget } = route.params;
  const [category, setCategory] = useState(''); // Начальное значение может быть пустым
  const [limit, setLimit] = useState('');

  const handleSave = () => {
    if (category && limit) {
      const newBudget = {
        category,
        limit: parseFloat(limit),
        spent: 0,
      };
      addBudget(newBudget);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить бюджет</Text>
      
      <Text style={styles.label}>Категория</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Выберите категорию" value="" />
        <Picker.Item label="Еда" value="еда" />
        <Picker.Item label="Транспорт" value="транспорт" />
        <Picker.Item label="Развлечение" value="развлечение" />
        <Picker.Item label="Шоппинг" value="шоппинг" />
        <Picker.Item label="Прочее" value="прочее" />
      </Picker>

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
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
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
