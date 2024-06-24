import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/page';
import { User } from '../componentes/types'; 

interface UserListProps {
  onSelectUser: (user: User) => void; // Especifica el tipo de onSelectUser
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]); // Especifica el tipo de users como un array de User

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)); // Asegúrate de castear cada usuario como tipo User
      setUsers(userList);
    };

    fetchUsers();
  }, []);

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