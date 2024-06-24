// src/app/componentes/ChatWindow.tsx

import React, { useEffect } from 'react';
import UserList from '../componentes/UserList';
import ChatArea from '../componentes/ChatArea';
import FunctionPanel from '../componentes/FunctionPanel';
import '../componentes/ChatWindow.css';
import { User, ChatMessageData } from '../componentes/types';

interface ChatWindowProps {
  onClose: () => void;
  messages: ChatMessageData[];
  selectedUser: User | null; 
  setSelectedUser: (user: User | null) => void; 
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, messages, selectedUser, setSelectedUser, setMessages }) => {
  useEffect(() => {
    console.log("ChatWindow re-renderizado"); // Verificar si se re-renderiza
  }, [messages, selectedUser]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user); // <-- Actualiza el estado en GamePage.tsx
  };

  return (
    <div className="chat-window">
      <button onClick={onClose}>Cerrar</button>
      <div className="chat-container">
        <UserList onSelectUser={handleSelectUser} />
        <ChatArea selectedUser={selectedUser} messages={messages} setMessages={setMessages} />
        <FunctionPanel />
      </div>
    </div>
  );
};

export default ChatWindow;
