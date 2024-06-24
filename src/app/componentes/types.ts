export interface Message {
    id: string; 
    text: string; 
    user: string; 
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
    message: string;
    user: string;
    timestamp: Date;
  }

  export interface MessageListProps {	
    userId: string;	
    messages: ChatMessageData[];
  }

  export interface ChatAreaProps {
    selectedUser: SelectedUser | null;
    messages: ChatMessageData[];
  }

  export interface MessageFormProps {
    user: string;
  }

  export interface ChatAreaProps {
    selectedUser: SelectedUser | null;
    messages: ChatMessageData[];
  }

  export interface MessageListProps {
    userId: string;
    messages: ChatMessageData[];
  }



  