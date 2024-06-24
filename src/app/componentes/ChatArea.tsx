import React from 'react';
import { useUser } from "@clerk/nextjs";
import MessageList from '../componentes/MessageList';
import MessageForm from '../componentes/MessageForm';
import { ChatMessageData } from '../componentes/types'; 

interface SelectedUser {
  id: string;
  name: string;
}

interface ChatAreaProps {
  selectedUser: SelectedUser | null;
  messages: ChatMessageData[]; 
}

export const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, messages }) => { 
  const { user } = useUser(); 

  if (!selectedUser) {
    return (
      <div className="chat-area">
        Selecciona un usuario para chatear
      </div>
    );
  }

  // Filtrar mensajes para el usuario seleccionado
  const filteredMessages = messages.filter(msg =>
    msg.user === selectedUser.id || 
    (user && msg.user === (user.fullName ?? user.emailAddresses[0].emailAddress)) 
  );

  return (
    <div className="chat-area">
      <h2>Chat con {selectedUser.name}</h2>
      <MessageList
        messages={filteredMessages}
        currentUser={user ? (user.fullName ?? user.emailAddresses[0].emailAddress) : ''}
      /> 
      {user && (
        <MessageForm user={user.fullName ?? user.emailAddresses[0].emailAddress} />
      )}
    </div>
  );
};

export default ChatArea;




