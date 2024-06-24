import React from 'react';
import MessageList from '../componentes/MessageList';
import MessageForm from '../componentes/MessageForm';
import { useUser } from "@clerk/nextjs";
import { ChatMessageData } from '../componentes/types';


interface SelectedUser {
  id: string;
  name: string;
}

interface ChatAreaProps {
  selectedUser: SelectedUser | null;
  messages: ChatMessageData[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>; // <-- Agregar setMessages
  
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, messages, setMessages }) => {  
  const { user } = useUser();

  if (!selectedUser) {
    return <div className="chat-area">Selecciona un usuario para chatear</div>;
  }

  // Filtrar mensajes para el usuario seleccionado
  const filteredMessages = messages.filter(msg =>
    msg.participants.includes(selectedUser.id) &&
    msg.participants.includes(user?.id ?? '')
  );
  

  return (
    <div className="chat-area">
      <h2>Chat con {selectedUser.name}</h2>
      <MessageList
        messages={filteredMessages}
        currentUser={user ? (user.fullName ?? user.emailAddresses[0].emailAddress) : ''}
      /> 
      {/*                                                                                ^-- Pasamos currentUser acá */}
      {user && (
    <MessageForm 
      user={user.fullName ?? user.emailAddresses[0].emailAddress} // Extraer el nombre o email del usuario
      selectedUser={selectedUser?.id ?? ""}  
      setMessages={setMessages} 
    />
  )}
    </div>
  );
};

export default ChatArea;

