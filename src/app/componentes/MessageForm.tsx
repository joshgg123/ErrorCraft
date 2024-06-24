import React, { useState } from 'react';
import { sendMessage } from '../firebase/page';
import { Message, User, ChatMessageData } from '../componentes/types';
import { useUser } from "@clerk/nextjs";

interface MessageFormProps {
  user: User;
  selectedUser: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>; // Añadir esto
}

const MessageForm: React.FC<MessageFormProps> = ({ user, selectedUser, setMessages }) => { // Añadir user aquí
  const [message, setMessage] = useState('');
  const { user: currentUser } = useUser(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && currentUser) { 
      const newMessage: Message = {
        id: '', 
        text: message,
        user: currentUser.fullName ?? currentUser.emailAddresses[0].emailAddress, 
        timestamp: new Date(),
      };
      try {
        await sendMessage(newMessage, selectedUser); 
        setMessages(prevMessages => [...prevMessages, newMessage]); // Añadir esto
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

