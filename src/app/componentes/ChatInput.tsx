// components/ChatInput.tsx
"use client"; // Indica que este componente se ejecutará en el cliente
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { sendMessage } from '../firebase/page';

const ChatInput = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [message, setMessage] = useState(''); // Estado local para el mensaje

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isSignedIn) return;
    try {
      await sendMessage(message, user!.firstName || 'Anonymous');
      setMessage('');
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        disabled={!isLoaded || !isSignedIn}
      />
      <button type="submit" disabled={!isLoaded || !isSignedIn}>
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;

