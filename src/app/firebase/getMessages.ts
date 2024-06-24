import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ChatMessageData } from "../componentes/types";

export function getMessages(callback: (messages: ChatMessageData[]) => void) {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessageData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          typeof data.message === "string" &&
          typeof data.user === "string" &&
          data.timestamp instanceof Timestamp 
        ) {
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

  