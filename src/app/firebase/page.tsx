"use client";
import { useAuth } from "@clerk/nextjs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDjPoIyEJ0xjH98l7c6WP2xxPFD9lsGjLM",
  authDomain: "errorcraft-1296d.firebaseapp.com",
  projectId: "errorcraft-1296d",
  storageBucket: "errorcraft-1296d.appspot.com",
  messagingSenderId: "815598507118",
  appId: "1:815598507118:web:1a803df62c94c26665c27f",
  measurementId: "G-J9B0FJKBB9"
};

// Connect to your Firebase app
const app = initializeApp(firebaseConfig);
// Connect to your Firestore database
const db = getFirestore(app);
// Connect to Firebase auth
const auth = getAuth(app);

export {db};
const analytics = getAnalytics(app);



