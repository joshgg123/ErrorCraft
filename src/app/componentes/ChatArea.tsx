import React, { useEffect, useState } from 'react';
import MessageList from '../componentes/MessageList';
import MessageForm from '../componentes/MessageForm';
import { ChatMessageData, SelectedUser } from '../componentes/types';
import { useUser } from "@clerk/nextjs";

interface ChatAreaProps {
  selectedUser: SelectedUser | null;
  messages: ChatMessageData[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ selectedUser, messages }) => {
  const { user } = useUser();
  const [filteredMessages, setFilteredMessages] = useState<ChatMessageData[]>([]);
 console.log("ChatAreaProps",selectedUser,messages)
 console.log(messages)
  useEffect(() => {
    if (selectedUser) {
      // Filtrar mensajes para el usuario seleccionado
      const filtered = messages.filter(msg =>
        (msg.user === selectedUser.name && msg.receiver === user?.fullName) || // Mensajes enviados al usuario actual
        (msg.user === user?.fullName && msg.receiver === selectedUser.name)    // Mensajes enviados por el usuario actual
      );
      setFilteredMessages(filtered);
    }
  }, [selectedUser, messages, user]);

  if (!selectedUser) {
    return (
      <div className="chat-area">
        Selecciona un usuario para chatear
      </div>
    );
  }

  return (
    <div className="chat-area">
      <h2>{selectedUser.name}</h2>
      <MessageList
        messages={filteredMessages}
        currentUser={user?.fullName ?? ''}
      />
      {user && (
        <MessageForm
          user={user?.fullName ?? ''}
          receiver={selectedUser.name} // Asegúrate de pasar 'receiver' aquí
        />
      )}
    </div>
  );
};

export default ChatArea;
