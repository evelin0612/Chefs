import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkbhNzOzcAxaNMQbIfXGY9qmvYM5josWo",
  authDomain: "chefs-secret-17b3d.firebaseapp.com",
  projectId: "chefs-secret-17b3d",
  storageBucket: "chefs-secret-17b3d.firebasestorage.app",
  messagingSenderId: "1002389565572",
  appId: "1:1002389565572:web:8fc1a1e37b9c931ff8d2d1"
};

const app = initializeApp(firebaseConfig);

// Seleciona a persistência correta dependendo do ambiente (Web vs Mobile)
const auth = initializeAuth(app, {
  persistence: Platform.OS === "web" 
    ? browserLocalPersistence 
    : getReactNativePersistence(AsyncStorage)
});

export { auth };