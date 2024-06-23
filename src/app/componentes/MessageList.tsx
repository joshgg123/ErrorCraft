import React from 'react';
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
        </div>
      ))}
    </div>
  );
};

export default MessageList;


