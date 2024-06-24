import React, { useState } from 'react';
import { sendMessage } from '../firebase/page';
import { ChatMessageData } from '../componentes/types';
import { text } from 'stream/consumers';

interface MessageFormProps {
  user: string;
  receiver: string; // Asegúrate de que 'receiver' esté declarado como prop
}

const MessageForm: React.FC<MessageFormProps> = ({ user, receiver }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessageData = {
        id: '', // Firestore generará automáticamente el ID
        texto: message,
        user: user,
        receiver: receiver,
        timestamp: new Date(),
      };
      try {
        await sendMessage(newMessage);
        setMessage('');
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default MessageForm;
