import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Aviso', 'Preencha o e-mail e a senha do Chef.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      let errorMessage = 'Não foi possível realizar o login.';

      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Conta não cadastrada ou senha incorreta. Verifique os dados ou crie uma nova conta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O e-mail digitado é inválido.';
      }

      Alert.alert('Falha ao Entrar', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="book-open-page-variant" size={70} color="#8B0000" />
      <Text style={styles.title}>Chef's Secret</Text>
      <Text style={styles.subtitle}>O Seu Caderno de Receitas Secreto</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail do Chef</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#8C6D53"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#8C6D53"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonText}>Abrir Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Não tem um diário? Crie uma conta aqui.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6E3', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 38, fontWeight: 'bold', color: '#2B1B17', marginTop: 10 },
  subtitle: { fontSize: 16, fontStyle: 'italic', color: '#8B0000', marginBottom: 20 },
  card: { width: '100%', backgroundColor: '#F4EAD5', padding: 20, borderRadius: 12, borderWidth: 2, borderColor: '#8C6D53', borderStyle: 'dashed' },
  label: { fontSize: 14, fontWeight: '500', color: '#3B2F2F', marginBottom: 5 },
  input: { backgroundColor: '#FDF6E3', borderWidth: 1, borderColor: '#8C6D53', borderRadius: 6, padding: 10, marginBottom: 15, color: '#2B1B17' },
  buttonPrimary: { backgroundColor: '#8B0000', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FDF6E3', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#8B0000', textAlign: 'center', marginTop: 15, fontSize: 12 }
});