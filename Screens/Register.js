import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Aviso', 'Preencha todos os campos para criar seu diário.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      Alert.alert(
        'Conta Criada com Sucesso! 🎉',
        'Seu diário de Chef foi criado. Faça o login para começar a salvar suas receitas.',
        [
          {
            text: 'Ir para o Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      let message = 'Não foi possível concluir o cadastro.';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'O formato do e-mail digitado é inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      }

      Alert.alert('Erro no Cadastro', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Chef</Text>
      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#8C6D53"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha (mínimo 6 dígitos)</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          placeholderTextColor="#8C6D53"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Já tem conta? Voltar ao login.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6E3', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 36, fontFamily: 'Caveat_700Bold', color: '#2B1B17', marginBottom: 20 },
  card: { width: '100%', backgroundColor: '#F4EAD5', padding: 20, borderRadius: 12, borderWidth: 2, borderColor: '#8C6D53', borderStyle: 'dashed' },
  label: { fontSize: 14, fontFamily: 'Merriweather_400Regular', color: '#3B2F2F', marginBottom: 5 },
  input: { backgroundColor: '#FDF6E3', borderWidth: 1, borderColor: '#8C6D53', borderRadius: 6, padding: 10, marginBottom: 15, fontFamily: 'Merriweather_400Regular', color: '#2B1B17' },
  buttonPrimary: { backgroundColor: '#8B0000', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FDF6E3', fontFamily: 'Merriweather_700Bold', fontSize: 16 },
  linkText: { color: '#8B0000', textAlign: 'center', marginTop: 15, fontFamily: 'Merriweather_400Regular', fontSize: 12 }
});