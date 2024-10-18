import React, { useState, useEffect, useRef } from 'react';
import styles from './terminal.module.css'; // Import the CSS module

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [commands, setCommands] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (input.trim()) {
                setCommands((prevCommands) => [...prevCommands, `> ${input}`]);
                setInput('');
                handleCommand(input.trim());
            }
        }
    };

    const handleCommand = (command: string) => {
        switch (command.toLowerCase()) {
            case 'help':
                setCommands((prevCommands) => [...prevCommands, 'Available commands: help, clear']);
                break;
            case 'clear':
                setCommands([]);
                break;
            default:
                setCommands((prevCommands) => [...prevCommands, `Command not recognized: ${command}`]);
                break;
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
