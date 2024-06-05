"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjPoIyEJ0xjH98l7c6WP2xxPFD9lsGjLM",
  authDomain: "errorcraft-1296d.firebaseapp.com",
  projectId: "errorcraft-1296d",
  storageBucket: "errorcraft-1296d.appspot.com",
  messagingSenderId: "815598507118",
  appId: "1:815598507118:web:1a803df62c94c26665c27f",
  measurementId: "G-J9B0FJKBB9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
const auth = getAuth(app);

export async function sendMessage(message: string, user: string) {
  try {
    const newMessageRef = await addDoc(collection(db, "messages"), {
      message,
      user,
      timestamp: new Date(),
    });
    console.log("Mensaje guardado con ID:", newMessageRef.id); // Mensaje de confirmación
  } catch (error) {
    console.error("Error al guardar mensaje:", error); // Manejo de errores
    throw error;
  }
}


export function getMessages(callback: (messages: ChatMessageData[]) => void) {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        typeof data.message === "string" &&
        typeof data.user === "string" &&
        data.timestamp instanceof Timestamp // Comprobar si es Timestamp de Firestore
      ) {
        // Convertir Timestamp a Date
        const timestamp = data.timestamp.toDate();
        messages.push({ id: doc.id, message: data.message, user: data.user, timestamp });
      } else {
        console.error("Mensaje con formato incorrecto:", doc.data());
      }
    });
    callback(messages);
  });

  return unsubscribe;
}

export interface ChatMessageData {
  id: string;
  message: string;
  user: string;
  timestamp: Date;
}



