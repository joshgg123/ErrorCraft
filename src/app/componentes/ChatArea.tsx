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
        (msg.user === selectedUser.id && msg.receiver === user?.id) || // Mensajes enviados al usuario actual
        (msg.user === user?.id && msg.receiver === selectedUser.id)    // Mensajes enviados por el usuario actual
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
      <h2>Chat con {selectedUser.name}</h2>
      <MessageList
        messages={filteredMessages}
        currentUser={user?.id ?? ''}
      />
      {user && (
        <MessageForm
          user={user?.id ?? ''}
          receiver={selectedUser.id} // Asegúrate de pasar 'receiver' aquí
        />
      )}
    </div>
  );
};

export default ChatArea;
