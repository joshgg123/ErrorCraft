import React from 'react';
<<<<<<< HEAD
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/page';
import { Message } from '../componentes/types'; 

interface MessageListProps {
  userId: string;
}

const MessageList: React.FC<MessageListProps> = ({ userId }) => {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, where('userId', '==', userId), orderBy('createdAt'));
  const [messages] = useCollectionData<Message>(q);

  return (
    <div className="message-list">
      {messages && messages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.text}</p>
=======
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
>>>>>>> BrunoJoshua
        </div>
      ))}
    </div>
  );
};

export default MessageList;

<<<<<<< HEAD

=======
>>>>>>> BrunoJoshua
