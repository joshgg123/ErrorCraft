import { db } from '../firebase/page';
import { addDoc, collection } from 'firebase/firestore';
import { Message } from '../componentes/types';

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