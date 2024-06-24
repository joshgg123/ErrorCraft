
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { Message } from "../componentes/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app);

export async function sendMessage(message: Message): Promise<void> {
  try {
    const newMessageRef = await addDoc(collection(db, 'messages'), {
      message: message.texto,
      user: message.user,
      receiver: message.receiver,
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
        messages.push({ id: doc.id, texto: data.message,receiver:data.receiver , user: data.user, timestamp });
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
  texto: string;
  user: string;
  receiver: string;
  timestamp: Date;
}


