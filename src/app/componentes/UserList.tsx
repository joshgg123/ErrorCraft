import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/page';
import { User } from '../componentes/types';
import { useUser } from "@clerk/nextjs"; // Asegúrate de importar useUser

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useUser(); // Obtén el usuario actual

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

      // Filtrar usuarios para excluir al usuario actual
      const filteredUsers = userList.filter(u => u.id !== user?.id); 

      setUsers(filteredUsers);
    };

    fetchUsers();
  }, [user]); // Agrega user como dependencia del useEffect

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} onClick={() => onSelectUser(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default UserList;


