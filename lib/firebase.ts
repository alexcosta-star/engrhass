// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlLhrz1IEiAVXEzyDIutxSPUxEwa5xURo",
  authDomain: "engrhass.firebaseapp.com",
  projectId: "engrhass",
  storageBucket: "engrhass.firebasestorage.app",
  messagingSenderId: "844071757832",
  appId: "1:844071757832:web:b7d89dfe969d661d8109bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
