// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfWSXb3AP9EMKd4QsavMlj8l4KHaZe5nw",
  authDomain: "cookmate-app.firebaseapp.com",
  projectId: "cookmate-app",
  storageBucket: "cookmate-app.firebasestorage.app",
  messagingSenderId: "276738548548",
  appId: "1:276738548548:web:67588b4eaa481fc8f56d11",
  measurementId: "G-P6VH2BHBSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
export const db = getFirestore(app);