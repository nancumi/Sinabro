import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuFj5vVnzZvR2xsaGZImokOCMbVFM4rHg",
  authDomain: "sinabro-ee19e.firebaseapp.com",
  projectId: "sinabro-ee19e",
  storageBucket: "sinabro-ee19e.firebasestorage.app",
  messagingSenderId: "591066042181",
  appId: "1:591066042181:web:52e1ce37a29cf3c6fef82c"
};

// Initialize Firebase (SSR 고려하여 중복 초기화 방지)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, googleProvider, db };
