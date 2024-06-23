import React, {useState} from 'react';
import UserList from '../componentes/UserList';
import ChatArea from '../componentes/ChatArea';
import FunctionPanel from '../componentes/FunctionPanel';
import '../componentes/ChatWindow.css';
import { User } from '../componentes/types';
import { useUser } from "@clerk/nextjs"; // Asegúrate de importar useUser

interface ChatWindowProps {
  onClose: () => void; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-window">
      <button onClick={onClose}>Cerrar</button>
      <div className="chat-container">
        <UserList onSelectUser={handleSelectUser} />
        {user && <ChatArea selectedUser={selectedUser} user={user.emailAddresses[0].emailAddress} />} 
        <FunctionPanel />
      </div>
    </div>
  );
};

export default ChatWindow;
