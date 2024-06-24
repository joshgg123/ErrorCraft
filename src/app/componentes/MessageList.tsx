import React from 'react';
import { ChatMessageData } from '../componentes/types';

interface MessageListProps {
  messages: ChatMessageData[];
  currentUser: string; // <-- Nueva prop para el usuario actual
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => { // <-- Agrega currentUser a las props
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.user === currentUser ? 'user' : 'other'}`}> 
          {/* Usa currentUser para la comparación */}
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
