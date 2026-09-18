import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCkbhNzOzcAxaNMQbIfXGY9qmvYM5josWo",
  authDomain: "chefs-secret-17b3d.firebaseapp.com",
  projectId: "chefs-secret-17b3d",
  storageBucket: "chefs-secret-17b3d.firebasestorage.app",
  messagingSenderId: "1002389565572",
  appId: "1:1002389565572:web:8fc1a1e37b9c931ff8d2d1"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Configura a autenticação para guardar o login do utilizador no telemóvel
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa a base de dados Firestore
export const db = getFirestore(app);