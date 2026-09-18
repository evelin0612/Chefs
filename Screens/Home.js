import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../src/services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [preparedDate, setPreparedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'recipes'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(list);
    });

    return () => unsubscribe();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setPreparedDate(selectedDate);
    }
  };

  const handleSaveRecipe = async () => {
    if (!title || !difficulty) {
      Alert.alert('Erro', 'Por favor, preencha o nome e a dificuldade da receita.');
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        difficulty,
        preparedDate: preparedDate.toLocaleDateString('pt-BR'),
        userId: auth.currentUser.uid,
      });

      setTitle('');
      setDifficulty('');
      setModalVisible(false);
      Alert.alert('Sucesso', 'Receita registrada no caderno!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro ao Sair', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Caderno de Receitas</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#8B0000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="feather" size={20} color="#FDF6E3" />
        <Text style={styles.addButtonText}> Escrever Nova Receita</Text>
      </TouchableOpacity>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Text style={styles.recipeDetail}>Dificuldade/Nota: {item.difficulty}</Text>
            <Text style={styles.recipeDetail}>Preparado em: {item.preparedDate}</Text>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Segredo do Prato</Text>

            <TextInput
              placeholder="Nome da Receita ou Prato"
              placeholderTextColor="#8C6D53"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <TextInput
              placeholder="Dificuldade (ex: Fácil, Média, ★★★★☆)"
              placeholderTextColor="#8C6D53"
              value={difficulty}
              onChangeText={setDifficulty}
              style={styles.input}
            />

            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <MaterialCommunityIcons name="calendar" size={20} color="#8B0000" />
              <Text style={styles.datePickerText}>
                {' Data: ' + preparedDate.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={preparedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6E3', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  headerTitle: { fontSize: 32, fontFamily: 'Caveat_700Bold', color: '#2B1B17' },
  logoutButton: { padding: 5 },
  addButton: { backgroundColor: '#8B0000', flexDirection: 'row', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#FDF6E3', fontFamily: 'Merriweather_700Bold', fontSize: 14 },
  recipeCard: { backgroundColor: '#F4EAD5', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#8C6D53', marginBottom: 12 },
  recipeTitle: { fontSize: 24, fontFamily: 'Caveat_700Bold', color: '#2B1B17' },
  recipeDetail: { fontSize: 12, fontFamily: 'Merriweather_400Regular', color: '#3B2F2F', marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#FDF6E3', borderWidth: 2, borderColor: '#8C6D53', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 28, fontFamily: 'Caveat_700Bold', color: '#2B1B17', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#F4EAD5', borderWidth: 1, borderColor: '#8C6D53', borderRadius: 6, padding: 10, marginBottom: 12, fontFamily: 'Merriweather_400Regular', color: '#2B1B17' },
  datePickerButton: { backgroundColor: '#F4EAD5', borderWidth: 1, borderColor: '#8C6D53', padding: 12, borderRadius: 6, flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  datePickerText: { fontFamily: 'Merriweather_400Regular', color: '#2B1B17', fontSize: 14 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  saveButton: { backgroundColor: '#8B0000', padding: 12, borderRadius: 6, flex: 1, marginRight: 5, alignItems: 'center' },
  saveButtonText: { color: '#FDF6E3', fontFamily: 'Merriweather_700Bold' },
  cancelButton: { backgroundColor: '#8C6D53', padding: 12, borderRadius: 6, flex: 1, marginLeft: 5, alignItems: 'center' },
  cancelButtonText: { color: '#FDF6E3', fontFamily: 'Merriweather_700Bold' }
});