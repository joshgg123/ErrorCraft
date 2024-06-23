import React, { useState } from 'react';
import { sendMessage } from '../firebase/page';
import { Message } from '../componentes/types';

interface MessageFormProps {
  user: string;
}

const MessageForm: React.FC<MessageFormProps> = ({ user }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: '', // Firestore generará automáticamente el ID
        text: message,
        user,
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



