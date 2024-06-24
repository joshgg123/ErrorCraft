"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { Message } from "../componentes/types";

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

export async function sendMessage(message: Message): Promise<void> {
  try {
    const newMessageRef = await addDoc(collection(db, 'messages'), {
      message: message.texto,
      user: message.user,
      timestamp: message.timestamp,
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


