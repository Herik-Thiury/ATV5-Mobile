import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC84FXBQjFSbPcWiOEl4QPiRaWetudUVr0",
  authDomain: "atv5-mobile.firebaseapp.com",
  projectId: "atv5-mobile",
  storageBucket: "atv5-mobile.firebasestorage.app",
  messagingSenderId: "262348251672",
  appId: "1:262348251672:web:3f67ea976f63e8bab6196d"
};

// Inicializa o App
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência no dispositivo
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
