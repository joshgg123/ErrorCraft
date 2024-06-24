"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { serverTimestamp, getFirestore, collection, where,  addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { Message } from "../componentes/types";

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
export const auth = getAuth(app);

export async function sendMessage(message: Message, selectedUserId: string): Promise<void> {
  try {
    await addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: serverTimestamp(),
      participants: [message.user, selectedUserId], 
    });
    console.log("Mensaje guardado con ID:"); 
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    throw error;
  }
}


export function getMessages(callback: (messages: ChatMessageData[]) => void, userId: string, selectedUserId: string) {
  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains-any", [userId, selectedUserId]),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
      messages.push({ id: doc.id, message: data.message, user: data.user, timestamp, participants: data.participants});
    });

    console.log("Mensajes actualizados en getMessages:", messages); // Agrega un log aquí para verificar los mensajes

    callback(messages);
  }, (error) => {
    console.error("Error al obtener mensajes:", error);
    // Manejo del error, por ejemplo, mostrar un mensaje al usuario
  });

  return unsubscribe;
}

export interface ChatMessageData {
  id: string;
  message: string;
  user: string;
  timestamp: Date;
  participants: string[];
}





