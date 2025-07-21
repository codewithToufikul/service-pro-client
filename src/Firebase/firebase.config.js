import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbaheoDKeqblflFuAK4kAkk3ITF-EZHm8",
  authDomain: "servies-pro.firebaseapp.com",
  projectId: "servies-pro",
  storageBucket: "servies-pro.firebasestorage.app",
  messagingSenderId: "949594375642",
  appId: "1:949594375642:web:79b59719b56224f5e7ece3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);