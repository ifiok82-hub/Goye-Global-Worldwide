import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: "elevated-haiku-wdw77",
  appId: "1:624961210110:web:f28c3036a4e98d01af87af",
  apiKey: "AIzaSyAS4InbIJRr8THjIKqKE_eAUsx7-HaGo7k",
  authDomain: "elevated-haiku-wdw77.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-goyeglobalworldw-c81a126e-169a-4ead-a7ad-8995f8140115",
  storageBucket: "elevated-haiku-wdw77.firebasestorage.app",
  messagingSenderId: "624961210110",
  measurementId: "",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
