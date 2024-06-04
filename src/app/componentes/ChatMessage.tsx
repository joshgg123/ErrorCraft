import React from 'react';

interface ChatMessageProps {
  message: string;
  user: string;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user, timestamp }) => (
  <div className="chat-message">
    <span className="user">{user}:</span>
    <span className="message">{message}</span>
    <span className="timestamp">{timestamp.toLocaleString()}</span>
  </div>
);

export default ChatMessage;
