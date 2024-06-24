import React, { useState } from 'react';
import UserList from '../componentes/UserList';
import ChatArea from '../componentes/ChatArea';
import FunctionPanel from '../componentes/FunctionPanel';
import '../componentes/ChatWindow.css';
import { User, ChatMessageData } from '../componentes/types';

interface ChatWindowProps {
  onClose: () => void;
  messages: ChatMessageData[]; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, messages }) => { // <-- Agrega messages a las props
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-window">
      <button onClick={onClose}>Cerrar</button>
      <div className="chat-container">
        <UserList onSelectUser={handleSelectUser} />
        {/* Pasamos los mensajes a ChatArea */}
        <ChatArea selectedUser={selectedUser} messages={messages} />  
        <FunctionPanel />
      </div>
    </div>
  );
};

export default ChatWindow;
