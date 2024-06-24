import React, { useState } from 'react';
import { sendMessage } from '../firebase/page';
import { Message, User } from '../componentes/types';
import {useUser} from "@clerk/nextjs";

interface MessageFormProps {
  user: User;
  selectedUser: string;
}

const MessageForm: React.FC<MessageFormProps> = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const { user } = useUser(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && user) { 
      const newMessage: Message = {
        id: '', 
        text: message,
        user: user.fullName ?? user.emailAddresses[0].emailAddress, 
        timestamp: new Date(),
      };
      try {
        await sendMessage(newMessage, selectedUser); 
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
