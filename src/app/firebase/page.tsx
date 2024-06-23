"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { Message } from "../componentes/types";

// Configuración de Firebase
const firebaseConfig = {
  // ... (tu configuración de Firebase)
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);

// Función para enviar un mensaje
export async function sendMessage(message: Message): Promise<void> {
  try {
    await addDoc(collection(db, 'messages'), {
      ...message,  // Incluye todos los campos de message
      createdAt: serverTimestamp(), // Usa serverTimestamp para la fecha
    });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    throw error;
  }
}

// Función para obtener mensajes en tiempo real
export function getMessages(callback: (messages: ChatMessageData[]) => void) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Verifica si createdAt es un Timestamp de Firestore antes de convertirlo
      const timestamp = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(); 
      messages.push({ id: doc.id, ...data, timestamp });
    });
    callback(messages);
  });

  return unsubscribe;
}

// Interfaz para los datos del mensaje del chat
export interface ChatMessageData {
  id: string;
  message: string;
  user: string;
  timestamp: Date;
  // Agrega otros campos si los necesitas (por ejemplo, userId)
}




