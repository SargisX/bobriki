import { useEffect, useState } from 'react';
import styles from './userList.module.css';
import { getAllUsers } from './users.api';
import { User } from '../auth/types';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        getAllUsers()
            .then(res => {
                setUsers(res);
            })
            .catch(err => {
                console.error('Error fetching users:', err);
            });
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if there's an admin user
    const adminUser = users.find(user => user.role === 'admin');


    return (
        <div className={styles.main}>
            <div className={styles.userListContainer}>
                <h1 className={styles.header}>User Contact List</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.scrollableList}>
                    {adminUser && (
                        <div className={`${styles.card} ${styles.adminCard}`}>
                            <h3 className={styles.username}>Admin</h3>
                            <p className={styles.password}>Password: {'*'.repeat(8)}</p>
                            <p className={styles.role}>Role: {adminUser.role}</p>
                            <span className={styles.index}>#Admin</span>
                        </div>
                    )}
                    <div className={styles.userList}>
                        {filteredUsers.map((user) => (
                            user.role !== 'admin' && (
                                <div key={user.id} className={styles.card}>
                                    <h3 className={styles.username}>{user.username}</h3>
                                    <p className={styles.password}>Password: {'*'.repeat(8)}</p>
                                    <p className={styles.role}>Role:
                                        {
                                            user.role
                                                .split("_")
                                                .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                                                .join(" ")
                                        }
                                    </p>
                                    <span className={styles.index}>#{Number(user.id) - 1}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
