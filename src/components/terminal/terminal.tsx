import React, { useState, useEffect, useRef } from 'react';
import styles from './terminal.module.css';

interface User {
    id: string;
    username: string;
    password: string;
    role: string;
}

interface Command {
    text: string;
    isError?: boolean;
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [commands, setCommands] = useState<Command[]>([]);
    const [editingProperty, setEditingProperty] = useState<string | null>(null);
    const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const getUserFromLocalStorage = (): User | null => {
        const usersData = localStorage.getItem('users');
        const users: User[] = usersData ? JSON.parse(usersData) : [];
        const sessionData = sessionStorage.getItem('user_session');
        const currentUserId = sessionData ? JSON.parse(sessionData).userId : null;
        return users.find((user) => user.id === currentUserId) || null;
    };

    const saveUserToLocalStorage = (updatedUser: User) => {
        const usersData = localStorage.getItem('users');
        const users: User[] = usersData ? JSON.parse(usersData) : [];

        const updatedUsers = users.map((user) =>
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
            } else if (input.trim()) {
                setCommands((prev) => [...prev, { text: `> ${input}` }]);
                handleCommand(input.trim());
                setInput('');
            }
        }
    };

    const handleEditInput = () => {
        const user = getUserFromLocalStorage();
        if (!user) {
            setCommands((prev) => [
                ...prev,
                { text: 'No user found in local storage.', isError: true },
            ]);
            return;
        }

        if (editingProperty === 'username') {
            const updatedUser = { ...user, username: input };
            saveUserToLocalStorage(updatedUser);
            setCommands((prev) => [
                ...prev,
                { text: `Username updated to: ${input}` },
            ]);
            setEditingProperty(null);
        } else if (editingProperty === 'password') {
            if (passwordCheck) {
                const updatedUser = { ...user, password: input };
                saveUserToLocalStorage(updatedUser);
                setCommands((prev) => [
                    ...prev,
                    { text: 'Password changed successfully.' },
                ]);
                setEditingProperty(null);
                setPasswordCheck(false);
            } else if (input === user.password) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'Current password verified. Enter new password:' },
                ]);
                setPasswordCheck(true);
            } else {
                setCommands((prev) => [
                    ...prev,
                    { text: 'Incorrect current password.', isError: true },
                ]);
                setEditingProperty(null);
            }
        }
        setInput('');
    };

    const handleCommand = (command: string) => {
        const [cmd, property, action] = command.split('.');

        if (cmd === 'user') {
            const user = getUserFromLocalStorage();
            if (!user) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'No user found in local storage.', isError: true },
                ]);
                return;
            }

            switch (property) {
                case 'username':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Username: ${user.username}` },
                    ]);
                    break;
                case 'role':
                    setCommands((prev) => [
                        ...prev,
                        { text: `User Role: ${user.role}` },
                    ]);
                    break;
                case 'password':
                case 'id':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Access denied: ${property} is protected.`, isError: true },
                    ]);
                    break;
                case 'edit':
                    if (action === 'username') {
                        setEditingProperty('username');
                        setCommands((prev) => [
                            ...prev,
                            { text: 'Enter new username:' },
                        ]);
                    } else if (action === 'password') {
                        setEditingProperty('password');
                        setCommands((prev) => [
                            ...prev,
                            { text: 'Enter current password:' },
                        ]);
                    } else {
                        setCommands((prev) => [
                            ...prev,
                            { text: `Cannot edit ${action}.`, isError: true },
                        ]);
                    }
                    break;
                default:
                    setCommands((prev) => [
                        ...prev,
                        { text: `Invalid user property: ${property}`, isError: true },
                    ]);
                    break;
            }
        } else {
            switch (cmd) {
                case 'help':
                    setCommands((prev) => [
                        ...prev,
                        { text: 'Available commands:' },
                        { text: '----------------------------------------------------' },
                        { text: '👤 User Commands:' },
                        { text: '  ✦ user.username          ➔ Display the username' },
                        { text: '  ✦ user.role             ➔ Display the user role' },
                        { text: '  ✦ user.edit.username    ➔ Edit the username' },
                        { text: '  ✦ user.edit.password    ➔ Change the password' },
                        { text: '----------------------------------------------------' },
                        { text: '🛠️ Utility Commands:' },
                        { text: '  ✦ clear                 ➔ Clear the terminal' },
                        { text: '  ✦ date                  ➔ Show the current date and time' },
                        { text: '  ✦ echo [text]           ➔ Repeat the input text' },
                        { text: '  ✦ version               ➔ Show the terminal version' },
                        { text: '----------------------------------------------------' },
                        { text: '❓ Help Commands:' },
                        { text: '  ✦ help                  ➔ Display this help message' },
                    ]);
                    break;
                case 'clear':
                    setCommands([]);
                    break;
                case 'date':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Current Date & Time: ${new Date().toLocaleString()}` },
                    ]);
                    break;
                case 'echo':
                    setCommands((prev) => [
                        ...prev,
                        { text: property || '' },
                    ]);
                    break;
                case 'version':
                    setCommands((prev) => [
                        ...prev,
                        { text: 'Terminal version: 1.0.0' },
                    ]);
                    break;
                default:
                    setCommands((prev) => [
                        ...prev,
                        { text: `Command not recognized: ${command}`, isError: true },
                    ]);
                    break;
            }
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
            <div>
                {commands.map((cmd, index) => (
                    <p
                        key={index}
                        className={`${styles.command} ${cmd.isError ? styles.error : ''}`}
                    >
                        {cmd.text}
                    </p>
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