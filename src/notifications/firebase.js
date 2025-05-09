// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { get } from "react-hook-form";

const firebaseConfig = {
  apiKey: "AIzaSyAoK4QSbOlD3qKnqvfgQVtfg63G_axHEvA",
  authDomain: "hangtime-e915c.firebaseapp.com",
  projectId: "hangtime-e915c",
  storageBucket: "hangtime-e915c.firebasestorage.app",
  messagingSenderId: "60757859820",
  appId: "1:60757859820:web:b587c2c1c15b3de7e334c9",
  measurementId: "G-RQSMBGGJSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
}
