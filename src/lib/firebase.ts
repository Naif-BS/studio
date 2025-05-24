// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';

// Your web app's Firebase configuration (use your actual credentials here)
const firebaseConfig = {
  apiKey: "AIzaSyDluqLuKutYp0PrJOjVDFpSuef4rGtkBXg",
  authDomain: "mediascope-vimbd.firebaseapp.com",
  projectId: "mediascope-vimbd",
  storageBucket: "mediascope-vimbd.firebasestorage.app",
  messagingSenderId: "28020752153",
  appId: "1:28020752153:web:fe2dd484777670e8cacf88"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };