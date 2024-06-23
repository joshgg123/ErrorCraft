import React from 'react';
import MessageList from '../componentes/MessageList';

interface SelectedUser {
  id: string;
  name: string;
}

interface ChatAreaProps {
  selectedUser: SelectedUser | null; 
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser }) => {
  if (!selectedUser) {
    return <div className="chat-area">Selecciona un usuario para chatear</div>;
  }

  return (
    <div className="chat-area">
      <h2>Chat con {selectedUser.name}</h2>
      <MessageList userId={selectedUser.id} />
    </div>
  );
};

export default ChatArea;

