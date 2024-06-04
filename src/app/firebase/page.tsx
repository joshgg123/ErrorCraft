"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCPW3CKXJDc_5XadYW9zNsvQ2IiHDSY-zs",
    authDomain: "errorcraft-f0d72.firebaseapp.com",
    projectId: "errorcraft-f0d72",
    storageBucket: "errorcraft-f0d72.appspot.com",
    messagingSenderId: "307701554089",
    appId: "1:307701554089:web:3d6fdf3210dd6b545882b8",
    measurementId: "G-MPZP7KH95J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);
const analytics = getAnalytics(app);



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



