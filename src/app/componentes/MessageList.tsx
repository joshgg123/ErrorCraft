import React from 'react';
import { ChatMessageData } from '../componentes/types';

interface MessageListProps {
  messages: ChatMessageData[];
  currentUser: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const formatTimestamp = (timestamp: Date) => {
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.user === currentUser ? 'user' : 'other'}`}>
          <div className="message-header">
            <span className="message-sender">{msg.user}</span>
            <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
          </div>
          <p className="message-text">{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;




