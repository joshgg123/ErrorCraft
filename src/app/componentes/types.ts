export interface Message {
    id: string; 
    texto: string; 
    user: string; 
    receiver: string;
    timestamp: Date; 
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: Date;
}

export interface SelectedUser {
    id: string;
    name: string;
}

export interface ChatMessageData {
    id: string;
    texto: string; // Renombramos 'message' a 'text' para que coincida con el tipo 'Message'
    user: string;
    receiver: string; // Agregamos 'receiver' como prop
    timestamp: Date;
  }

  export interface MessageListProps {
    userId: string;
    receiverId: string;
    messages: ChatMessageData[];
  }


