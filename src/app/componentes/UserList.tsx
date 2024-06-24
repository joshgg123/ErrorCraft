import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/page';
<<<<<<< HEAD
import { User } from '../componentes/types'; // Importa el tipo User si está definido en '../types'

interface UserListProps {
  onSelectUser: (user: User) => void; // Especifica el tipo de onSelectUser
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]); // Especifica el tipo de users como un array de User
=======
import { User } from '../componentes/types';
import { useUser } from "@clerk/nextjs"; // Asegúrate de importar useUser

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useUser(); // Obtén el usuario actual
>>>>>>> BrunoJoshua

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
<<<<<<< HEAD
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)); // Asegúrate de castear cada usuario como tipo User
      setUsers(userList);
    };

    fetchUsers();
  }, []);
=======
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

      // Filtrar usuarios para excluir al usuario actual
      const filteredUsers = userList.filter(u => u.id !== user?.id); 

      setUsers(filteredUsers);
    };

    fetchUsers();
  }, [user]); // Agrega user como dependencia del useEffect
>>>>>>> BrunoJoshua

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

<<<<<<< HEAD
=======

>>>>>>> BrunoJoshua
