import React, {useEffect} from 'react';
import { ChatMessageData } from '../componentes/types';

interface MessageListProps {
  messages: ChatMessageData[];
  currentUser: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  useEffect(() => {
    console.log("MessageList re-renderizado"); // Verificar si se re-renderiza
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.user === currentUser ? 'user' : 'other'}`}>
          <div className="message-header">
            <span className="message-sender">{msg.user}</span>
          </div>
          <p className="message-text">{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;




