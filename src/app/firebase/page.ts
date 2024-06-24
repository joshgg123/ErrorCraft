"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnnX1T8eyfrgAwG-6OpvKklmTjrzrzL10",
  authDomain: "errorcraft-af5c0.firebaseapp.com",
  projectId: "errorcraft-af5c0",
  storageBucket: "errorcraft-af5c0.appspot.com",
  messagingSenderId: "285589731264",
  appId: "1:285589731264:web:7d92bf63f89582b5913a25"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);


export interface ChatMessageData {
  id: string;
  texto: string;
  user: string;
  receiver: string;
  timestamp: Date;
}


