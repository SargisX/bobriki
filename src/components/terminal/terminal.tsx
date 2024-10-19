import React, { useState, useEffect, useRef } from 'react';
import styles from './terminal.module.css';

interface User {
    id: string;
    username: string;
    password: string;
    role: string;
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [commands, setCommands] = useState<string[]>([]);
    const [editingProperty, setEditingProperty] = useState<string | null>(null);
    const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);


    const getUserFromLocalStorage = (): User | null => {
        const usersData = localStorage.getItem('users');
        const users: User[] = usersData ? JSON.parse(usersData) : [];
        const sessionData = sessionStorage.getItem("user_session");
        const currentUserId = sessionData ? JSON.parse(sessionData).userId : null;
        return users.find(user => user.id === currentUserId) || null;
    };


    const saveUserToLocalStorage = (updatedUser: User) => {
        const usersData = localStorage.getItem('users');
        const users: User[] = usersData ? JSON.parse(usersData) : [];

        const updatedUsers = users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (editingProperty) {

                handleEditInput();
            } else {

                if (input.trim()) {
                    setCommands((prev) => [...prev, `> ${input}`]);
                    handleCommand(input.trim());
                    setInput('');
                }
            }
        }
    };

    const handleEditInput = () => {
        const user = getUserFromLocalStorage();
        if (!user) {
            setCommands((prev) => [...prev, 'No user found in local storage.']);
            return;
        }

        if (editingProperty === 'username') {

            const updatedUser = { ...user, username: input };
            saveUserToLocalStorage(updatedUser);
            setCommands((prev) => [...prev, `Username updated to: ${input}`]);
            setEditingProperty(null);
        } else if (editingProperty === 'password') {
            if (passwordCheck) {

                const updatedUser = { ...user, password: input };
                saveUserToLocalStorage(updatedUser);
                setCommands((prev) => [...prev, `Password changed successfully.`]);
                setEditingProperty(null);
                setPasswordCheck(false);
            } else {

                if (input === user.password) {
                    setCommands((prev) => [...prev, 'Current password verified. Enter new password:']);
                    setPasswordCheck(true);
                } else {
                    setCommands((prev) => [...prev, 'Incorrect current password.']);
                    setEditingProperty(null);
                }
            }
        }

        setInput('');
    };

    const handleCommand = (command: string) => {
        const [cmd, property, action] = command.split('.');

        if (cmd === 'user') {
            const user = getUserFromLocalStorage();
            if (!user) {
                setCommands((prev) => [...prev, 'No user found in local storage.']);
                return;
            }

            switch (property) {
                case 'username':
                    setCommands((prev) => [...prev, `Username: ${user.username}`]);
                    break;
                case 'role':
                    setCommands((prev) => [...prev, `User Role: ${user.role}`]);
                    break;
                case 'password':
                case 'id':
                    setCommands((prev) => [
                        ...prev,
                        `Access denied: ${property} is protected.`,
                    ]);
                    break;
                case 'edit':
                    if (action === 'username') {
                        setEditingProperty('username');
                        setCommands((prev) => [...prev, 'Enter new username:']);
                    } else if (action === 'password') {
                        setEditingProperty('password');
                        setCommands((prev) => [...prev, 'Enter current password:']);
                    } else {
                        setCommands((prev) => [
                            ...prev,
                            `Cannot edit ${action}.`,
                        ]);
                    }
                    break;
                default:
                    setCommands((prev) => [
                        ...prev,
                        `Invalid user property: ${property}`,
                    ]);
                    break;
            }
        } else {
            switch (cmd) {
                case 'help':
                    setCommands((prev) => [
                        ...prev,
                        'Available commands:',
                        '',
                        '----------------------------------------------------',
                        '👤 User Commands:',
                        '  ✦ user.username          ➔ Display the username',
                        '  ✦ user.role             ➔ Display the user role',
                        '  ✦ user.edit.username    ➔ Edit the username',
                        '  ✦ user.edit.password    ➔ Change the password',
                        '',
                        '----------------------------------------------------',
                        '🛠️ Utility Commands:',
                        '  ✦ clear                 ➔ Clear the terminal',
                        '  ✦ date                  ➔ Show the current date and time',
                        '  ✦ echo [text]           ➔ Repeat the input text',
                        '  ✦ version               ➔ Show the terminal version',
                        '',
                        '----------------------------------------------------',
                        '❓ Help Commands:',
                        '  ✦ help                  ➔ Display this help message',
                        '',
                    ]);
                    break;

                case 'clear':
                    setCommands([]);
                    break;
                case 'date':
                    setCommands((prev) => [
                        ...prev,
                        `Current Date & Time: ${new Date().toLocaleString()}`,
                    ]);
                    break;
                case 'echo':
                    setCommands((prev) => [...prev, property || '']);
                    break;
                case 'version':
                    setCommands((prev) => [...prev, 'Terminal version: 1.0.0']);
                    break;
                default:
                    setCommands((prev) => [
                        ...prev,
                        `Command not recognized: ${command}`,
                    ]);
                    break;
            }
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className={styles.terminal}>
            <div>
                {commands.map((cmd, index) => (
                    <p key={index} className={styles.command}>{cmd}</p>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <span className={styles.prompt}>&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
            </div>
        </div>
    );
};

export default Terminal;
