import React from 'react';
import MessageList from '../componentes/MessageList';
import MessageForm from '../componentes/MessageForm';

interface SelectedUser {
  id: string;
  name: string;
}

interface ChatAreaProps {
  selectedUser: SelectedUser | null; 
  user: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, user }) => {
  if (!selectedUser) {
    return <div className="chat-area">Selecciona un usuario para chatear</div>;
  }

  return (
    <div className="chat-area">
      <h2>Chat con {selectedUser.name}</h2>
      <MessageList userId={selectedUser.id} />
      <MessageForm user={user} /> 
    </div>
  );
};

export default ChatArea;
