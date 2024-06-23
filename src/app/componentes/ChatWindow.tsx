import React, {useState} from 'react';
import UserList from '../componentes/UserList';
import ChatArea from '../componentes/ChatArea';
import FunctionPanel from '../componentes/FunctionPanel';
import '../componentes/ChatWindow.css';
import { User } from '../componentes/types';

interface ChatWindowProps {
    onClose: () => void; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        // Lógica adicional para manejar la selección de usuario
    };

    return (
        <div className="chat-window">
            <button onClick={onClose}>Cerrar</button>
            <div className="chat-container">
                <UserList onSelectUser={handleSelectUser} />
                <ChatArea selectedUser={selectedUser} />
                <FunctionPanel />
            </div>
        </div>
    );
};

export default ChatWindow;

